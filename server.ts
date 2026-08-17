import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY environment variable is not configured or uses placeholder.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || '',
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });
  }
  return aiClient;
}

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(8),
}).or(z.object({ email: z.string().email(), password: z.string().min(8) }));

function createSuccess(data: any, message = 'Success') {
  return { success: true, message, data };
}

function createError(message: string, errorCode?: string) {
  return { success: false, message, errorCode };
}

function setSessionCookie(res: express.Response, token: string) {
  res.cookie('session_token', token, authCookieOptions);
}

function clearSessionCookie(res: express.Response) {
  res.clearCookie('session_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

function getAccessToken(user: any) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '30m' },
  );
}

async function readAuthenticatedUser(req: express.Request) {
  const token = req.cookies?.session_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { sub: string; role: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  void readAuthenticatedUser(req).then((user) => {
    if (!user) {
      return res.status(401).json(createError('Unauthorized.', 'UNAUTHORIZED'));
    }
    (req as any).user = user;
    return next();
  });
}

function requireRole(requiredRole: string | string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json(createError('Forbidden.', 'FORBIDDEN'));
    }
    return next();
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 4000;
  const isDevelopment = process.env.NODE_ENV === 'development';

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Fun With Learn Dev Server',
      database: 'SQLite + Prisma',
      aiEnabled: !!process.env.GEMINI_API_KEY,
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    const user = await readAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    return res.json({
      authenticated: true,
      user,
    });
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const payload = loginSchema.parse(req.body);
      const identifier = 'identifier' in payload 
        ? String(payload.identifier).trim()
        : String(payload.email).trim();
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { id: identifier },
          ],
        },
      });

      if (!user) {
        return res.status(401).json(createError('Invalid email/User ID or password.', 'INVALID_CREDENTIALS'));
      }

      if (user.status === 'SUSPENDED') {
        return res.status(403).json(createError('Your account has been suspended. Please contact the administrator.', 'ACCOUNT_SUSPENDED'));
      }

      if (user.status === 'INACTIVE') {
        return res.status(403).json(createError('Your account is currently inactive.', 'ACCOUNT_INACTIVE'));
      }

      const validPassword = await bcrypt.compare(payload.password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json(createError('Invalid email/User ID or password.', 'INVALID_CREDENTIALS'));
      }

      if (!user.emailVerified) {
        return res.status(403).json(createError('Please verify your email before logging in.', 'EMAIL_NOT_VERIFIED'));
      }

      const token = getAccessToken(user);
      setSessionCookie(res, token);

      return res.json(createSuccess({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, 'Login successful'));
    } catch (error: any) {
      return res.status(400).json(createError(error.message || 'Login failed.', 'VALIDATION_ERROR'));
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    clearSessionCookie(res);
    return res.json(createSuccess({}, 'Logged out successfully'));
  });

  app.post('/api/auth/register', async (req, res) => {
    const registerSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      mobile: z.string().min(8),
      password: z.string().min(8),
      role: z.enum(['STUDENT', 'PARENT']).default('STUDENT'),
    });

    try {
      const payload = registerSchema.parse(req.body);
      const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
      if (existing) {
        return res.status(409).json(createError('This email is already registered.', 'USER_EXISTS'));
      }

      const passwordHash = await bcrypt.hash(payload.password, 12);
      const user = await prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email.toLowerCase(),
          mobile: payload.mobile,
          passwordHash,
          role: payload.role as any,
          status: 'PENDING',
          emailVerified: false,
        },
      });

      return res.status(201).json(createSuccess({ userId: user.id }, 'Registration successful. Please verify your email.'));
    } catch (error: any) {
      return res.status(400).json(createError(error.message || 'Registration failed.', 'VALIDATION_ERROR'));
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.json(createSuccess({}, 'If an account exists with this email, a password reset link has been sent.'));
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user) {
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken: token, passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000) },
      });
    }

    return res.json(createSuccess({}, 'If an account exists with this email, a password reset link has been sent.'));
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    const { token, password } = req.body || {};
    if (!token || !password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json(createError('Invalid reset request.', 'INVALID_REQUEST'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { sub: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) {
        return res.status(400).json(createError('Password reset token is invalid or expired.', 'INVALID_TOKEN'));
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, passwordResetToken: null, passwordResetExpires: null },
      });

      return res.json(createSuccess({}, 'Password reset successful.'));
    } catch {
      return res.status(400).json(createError('Password reset token is invalid or expired.', 'INVALID_TOKEN'));
    }
  });

  app.get('/api/student/profile', requireAuth, requireRole('STUDENT'), async (req, res) => {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    return res.json(createSuccess({ user: dbUser ? { id: dbUser.id, name: dbUser.name, role: dbUser.role } : null }));
  });

  app.get('/api/dashboard/student', requireAuth, requireRole('STUDENT'), async (req, res) => {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    return res.json(createSuccess({
      profile: {
        name: dbUser?.name ?? user.name,
        email: dbUser?.email ?? user.email,
        role: 'student',
        subscriptionPlan: 'Premium',
        progress: 76,
        completedHours: 18,
        totalXP: 1480,
        classLevel: 'Class 10',
      },
      stats: [
        { label: 'Daily Streak', value: '4 Days', tone: 'orange' },
        { label: 'Study XP', value: '1480', tone: 'purple' },
        { label: 'Total Watched', value: '18 hrs', tone: 'indigo' },
      ],
      upcomingClasses: [
        { subject: 'Mathematics', teacher: 'Dr. Ramesh Sharma', topic: 'Quadratic Equations', date: 'Today', startTime: '09:30 AM', endTime: '10:10 AM', status: 'Live Now' },
        { subject: 'Science', teacher: 'Prof. Neha Gupta', topic: 'Chemical Reactions', date: 'Today', startTime: '11:00 AM', endTime: '11:45 AM', status: 'Upcoming' },
        { subject: 'English', teacher: 'Sarah Jenkins', topic: 'Grammar Correction', date: 'Today', startTime: '02:00 PM', endTime: '02:40 PM', status: 'Completed' },
      ],
      progress: {
        subjectWise: [
          { name: 'Mathematics', value: 82 },
          { name: 'Science', value: 77 },
          { name: 'English', value: 71 },
          { name: 'Social Science', value: 68 },
        ],
        chapterWise: [
          { name: 'Numbers', value: 88 },
          { name: 'Fractions', value: 70 },
          { name: 'Geometry', value: 63 },
          { name: 'Measurement', value: 81 },
        ],
      },
      assignments: [
        { id: 'a1', title: 'Fractions Practice Sheet', classLevel: 'Class 5', subject: 'Mathematics', chapter: 'Fractions', dueDate: '2026-08-18', status: 'Pending', marks: 20 },
        { id: 'a2', title: 'Chemical Reactions Worksheet', classLevel: 'Class 10', subject: 'Science', chapter: 'Chemical Reactions', dueDate: '2026-08-16', status: 'Submitted', marks: 25 },
        { id: 'a3', title: 'Electrostatics Assignment', classLevel: 'Class 12', subject: 'Physics', chapter: 'Electrostatics', dueDate: '2026-08-20', status: 'Late', marks: 30 },
      ],
      quizzes: [
        { id: 'q1', title: 'Fractions Quick Quiz', subject: 'Mathematics', chapter: 'Fractions', classLevel: 'Class 5', timeLimit: 15 },
      ],
      tests: [
        { id: 't1', title: 'Chapter Test: Real Numbers', subject: 'Mathematics', chapter: 'Real Numbers', classLevel: 'Class 10', totalMarks: 40, timeLimit: 45 },
      ],
      subjects: [
        { id: 'math-10', name: 'Mathematics', icon: '∑', completedChapters: 3, totalChapters: 4, progress: 74, chapters: [
          { id: 'm1', name: 'Real Numbers', progress: 82, completedTopics: 11, totalTopics: 13, lessonType: 'Learn' },
          { id: 'm2', name: 'Polynomials', progress: 76, completedTopics: 9, totalTopics: 12, lessonType: 'Quiz' },
          { id: 'm3', name: 'Triangles', progress: 70, completedTopics: 8, totalTopics: 11, lessonType: 'Video' },
          { id: 'm4', name: 'Trigonometry', progress: 69, completedTopics: 10, totalTopics: 14, lessonType: 'Test' },
        ] },
        { id: 'science-10', name: 'Science', icon: '🔬', completedChapters: 2, totalChapters: 3, progress: 77, chapters: [
          { id: 'sc1', name: 'Chemical Reactions', progress: 88, completedTopics: 9, totalTopics: 10, lessonType: 'Learn' },
          { id: 'sc2', name: 'Light', progress: 73, completedTopics: 7, totalTopics: 9, lessonType: 'Practice' },
          { id: 'sc3', name: 'Life Processes', progress: 69, completedTopics: 8, totalTopics: 11, lessonType: 'Video' },
        ] },
      ],
    }));
  });

  app.get('/api/dashboard/teacher', requireAuth, requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    return res.json(createSuccess({
      profile: {
        name: dbUser?.name ?? user.name,
        email: dbUser?.email ?? user.email,
        role: 'teacher',
      },
      stats: [
        { label: 'Earnings Analytics', value: '₹42,500', tone: 'emerald' },
        { label: 'Total Enrolled Students', value: '3,421', tone: 'indigo' },
        { label: 'Syllabus Classrooms', value: '5 Scheduled', tone: 'purple' },
        { label: 'Recorded Modules', value: '13 Modules', tone: 'amber' },
      ],
      liveClasses: [
        { id: 'live-1', title: 'Quadratic Equations', teacherName: 'Dr. Ramesh Sharma', timing: new Date().toISOString(), timingFormatted: 'Today (Live)', status: 'upcoming', subject: 'Mathematics', classLevel: 'Class 10', enrolledCount: 146, description: 'Board-focused revision drill', meetingId: 'room-1' },
        { id: 'live-2', title: 'Chemical Reactions Basics', teacherName: 'Prof. Neha Gupta', timing: new Date(Date.now() + 3600000).toISOString(), timingFormatted: 'Today (Next)', status: 'upcoming', subject: 'Science', classLevel: 'Class 10', enrolledCount: 92, description: 'Concept recap and problem solving', meetingId: 'room-2' },
      ],
      recordedVideos: [
        { id: 'rec-1', title: 'Trigonometry Shortcut Tricks', category: 'Mathematics', teacherName: 'Dr. Ramesh Sharma', watchProgress: 0, duration: '42 mins', views: 1200, thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500', description: 'Fast and concept-first revision', classLevel: 'Class 10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
    }));
  });

  app.get('/api/dashboard/admin', requireAuth, requireRole('ADMIN'), async (req, res) => {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } });

    return res.json(createSuccess({
      profile: {
        name: dbUser?.name ?? user.name,
        email: dbUser?.email ?? user.email,
        role: 'admin',
      },
      stats: [
        { label: 'Global Revenue', value: '₹1,42,500', tone: 'indigo' },
        { label: 'Accounts Count', value: String(users.length + 1), tone: 'purple' },
        { label: 'Syllabus Coverage', value: '8 active', tone: 'emerald' },
        { label: 'Model Provider', value: 'Gemini 3.5 Flash', tone: 'amber' },
      ],
      users: users.map((entry) => ({ name: entry.name, email: entry.email, role: entry.role, plan: entry.role === 'STUDENT' ? 'Premium' : 'None' })),
      logs: [
        'System initialization successful - Express + Vite server ready',
        'User student profile set to "Premium" state via sandboxed Razorpay verification',
        'Live classroom friction coefficients established successfully - WebRTC active',
        'AI Course recommendations generated for student - Gemini-3.5-flash',
      ],
    }));
  });

  app.get('/api/teacher/classes', requireAuth, requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
    return res.json(createSuccess({ classes: [] }));
  });

  app.get('/api/admin/users', requireAuth, requireRole('ADMIN'), async (req, res) => {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } });
    return res.json(createSuccess({ users }));
  });

  app.post('/api/ai/chatbot', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message field is required' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          text: `[Offline Demo Mode] Thanks for asking about: "${message}". Connect your GEMINI_API_KEY to unlock real AI tutoring.`,
          simulated: true,
        });
      }

      const ai = getAiClient();
      const prevMessageContext = (history || [])
        .slice(-6)
        .map((h: any) => `${h.senderName || h.role}: ${h.text}`)
        .join('\n');

      const fullPrompt = `${prevMessageContext}\nStudent: ${message}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: 'You are "Fun Chatbot"... Keep answers short and educational.',
        },
      });

      res.json({ text: response.text || 'I understand your query, but could not produce an output.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate AI response: ' + err.message });
    }
  });

  app.post('/api/ai/recommend-courses', async (req, res) => {
    const { grade, interest, currentScore } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ recommendations: [
        { title: `Mastery Course for ${grade || 'Class 10'} ${interest || 'Science/Math'}`, scoreTarget: 'Target: 95%+', topic: 'Algebra & conceptual practice', reason: 'Built for exam excellence.' },
        { title: 'Competitive Bridge', scoreTarget: 'Target: Olympiad Excellence', topic: 'Advanced concept drills', reason: 'Strengthens analytical speed.' },
      ], simulated: true });
    }

    try {
      const ai = getAiClient();
      const prompt = `Recommend exactly 2 study topics for ${grade || 'Class 10'} with interest ${interest || 'Science and Math'}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const text = response.text || '[]';
      return res.json({ recommendations: JSON.parse(text) });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch recommendations: ' + err.message });
    }
  });

  app.post('/api/ai/learning-path', async (req, res) => {
    const { grade, subject, currentScore } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ path: { title: `${subject || 'Physics'} path`, estimatedDuration: '14 Days Revision', steps: [{ day: 'Day 1', focus: 'Concept recap', task: 'Solve worksheet' }] }, simulated: true });
    }

    try {
      const ai = getAiClient();
      const prompt = `Create a revision path for ${grade || 'Class 12'} in ${subject || 'Physics'} with current score ${currentScore || '65%'}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const text = response.text || '{}';
      return res.json({ path: JSON.parse(text) });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to customize revision path: ' + err.message });
    }
  });

  // ============= LMS ENDPOINTS =============

  // GET all classes (public)
  app.get('/api/classes', async (req, res) => {
    try {
      const classes = await prisma.class.findMany({
        include: {
          subjects: true,
          _count: { select: { enrollments: true } },
        },
      });

      return res.json(createSuccess({
        classes: classes.map(c => ({
          id: c.id,
          name: c.name,
          level: c.level,
          description: c.description,
          subjectCount: c.subjects.length,
          enrolledCount: c._count.enrollments,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch classes'));
    }
  });

  // GET class details (public)
  app.get('/api/classes/:classId', async (req, res) => {
    try {
      const { classId } = req.params;
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          subjects: {
            include: {
              chapters: true,
            },
          },
        },
      });

      if (!classData) {
        return res.status(404).json(createError('Class not found'));
      }

      return res.json(createSuccess({
        class: {
          id: classData.id,
          name: classData.name,
          level: classData.level,
          description: classData.description,
          subjects: classData.subjects.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            chapterCount: s.chapters.length,
          })),
        },
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch class details'));
    }
  });

  // GET enrolled classes for student
  app.get('/api/student/classes', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id, status: 'ACTIVE' },
        include: {
          class: {
            include: {
              subjects: true,
            },
          },
          progress: true,
        },
      });

      return res.json(createSuccess({
        enrolledClasses: enrollments.map(e => ({
          id: e.class.id,
          name: e.class.name,
          level: e.class.level,
          progress: e.progress?.averageScore ?? 0,
          subjects: e.class.subjects.map(s => ({ id: s.id, name: s.name })),
          enrolledAt: e.enrolledAt,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch enrolled classes'));
    }
  });

  // GET student assignments
  app.get('/api/student/assignments', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const submissions = await prisma.assignmentSubmission.findMany({
        where: { studentId: student.id },
        include: {
          assignment: {
            include: { subject: true },
          },
        },
        orderBy: { assignment: { dueDate: 'asc' } },
      });

      return res.json(createSuccess({
        assignments: submissions.map(sub => ({
          id: sub.assignment.id,
          title: sub.assignment.title,
          description: sub.assignment.description,
          subject: sub.assignment.subject.name,
          dueDate: sub.assignment.dueDate,
          totalMarks: sub.assignment.totalMarks,
          status: sub.status,
          marksObtained: sub.marks,
          feedback: sub.feedback,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch assignments'));
    }
  });

  // GET student progress
  app.get('/api/student/progress', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        include: { progress: true },
      });

      const overallProgress = enrollments[0]?.progress ?? null;

      return res.json(createSuccess({
        progress: {
          averageScore: overallProgress?.averageScore ?? 0,
          totalHoursSpent: overallProgress?.totalHoursSpent ?? 0,
          completedAssignments: overallProgress?.completedAssignments ?? 0,
          totalAssignments: overallProgress?.totalAssignments ?? 0,
          passedTests: overallProgress?.passedTests ?? 0,
          totalTests: overallProgress?.totalTests ?? 0,
        },
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch progress'));
    }
  });

  // GET student quizzes
  app.get('/api/student/quizzes', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const attempts = await prisma.quizAttempt.findMany({
        where: { studentId: student.id },
        include: {
          quiz: {
            include: { subject: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json(createSuccess({
        quizzes: attempts.map(a => ({
          id: a.quiz.id,
          title: a.quiz.title,
          description: a.quiz.description,
          subject: a.quiz.subject.name,
          timeLimit: a.quiz.timeLimit,
          totalMarks: a.quiz.totalMarks,
          status: a.status,
          marksObtained: a.marksObtained,
          percentage: a.percentage,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch quizzes'));
    }
  });

  // GET student tests
  app.get('/api/student/tests', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const attempts = await prisma.testAttempt.findMany({
        where: { studentId: student.id },
        include: {
          test: {
            include: { subject: true },
          },
        },
        orderBy: { test: { scheduledAt: 'asc' } },
      });

      return res.json(createSuccess({
        tests: attempts.map(a => ({
          id: a.test.id,
          title: a.test.title,
          description: a.test.description,
          subject: a.test.subject.name,
          scheduledAt: a.test.scheduledAt,
          duration: a.test.duration,
          totalMarks: a.test.totalMarks,
          status: a.status,
          marksObtained: a.marksObtained,
          percentage: a.percentage,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch tests'));
    }
  });

  // POST enroll student in class (requires auth)
  app.post('/api/student/enroll', requireAuth, requireRole('STUDENT'), async (req, res) => {
    try {
      const { classId } = req.body;
      if (!classId) {
        return res.status(400).json(createError('Class ID is required'));
      }

      const user = (req as any).user;
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (!student) {
        return res.status(404).json(createError('Student profile not found'));
      }

      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classExists) {
        return res.status(404).json(createError('Class not found'));
      }

      const existing = await prisma.enrollment.findUnique({
        where: { studentId_classId: { studentId: student.id, classId } },
      });

      if (existing) {
        return res.status(409).json(createError('Already enrolled in this class'));
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classId,
          status: 'ACTIVE',
        },
      });

      await prisma.studentProgress.create({
        data: {
          enrollmentId: enrollment.id,
        },
      });

      return res.status(201).json(createSuccess({ enrollment }, 'Enrollment successful'));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Enrollment failed'));
    }
  });

  // GET teacher classes
  app.get('/api/teacher/classes', requireAuth, requireRole(['TEACHER', 'ADMIN']), async (req, res) => {
    try {
      const user = (req as any).user;
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      });

      if (!teacher) {
        return res.status(404).json(createError('Teacher profile not found'));
      }

      const classes = await prisma.class.findMany({
        where: { teacherId: teacher.id },
        include: {
          subjects: true,
          enrollments: true,
        },
      });

      return res.json(createSuccess({
        classes: classes.map(c => ({
          id: c.id,
          name: c.name,
          level: c.level,
          description: c.description,
          subjectCount: c.subjects.length,
          studentCount: c.enrollments.length,
        })),
      }));
    } catch (error: any) {
      return res.status(500).json(createError(error.message || 'Failed to fetch classes'));
    }
  });

  if (isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      return res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started in ${isDevelopment ? 'development' : 'production'} mode. Listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to launch application server:', err);
});
