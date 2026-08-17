import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { z } from 'zod';
import { signAccessToken, signRefreshToken, hashToken, makeRandomToken } from './src/auth/helpers';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use('/api', globalLimiter);

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(8),
  password: z.string().min(8),
  role: z.enum(['STUDENT', 'PARENT']).default('STUDENT'),
});

function createSuccess(data: any, message = 'Success') {
  return { success: true, message, data };
}

function createError(message: string, errorCode?: string) {
  return { success: false, message, errorCode };
}

function setAuthCookie(res: express.Response, refreshToken: string) {
  res.cookie('refresh_token', refreshToken, authCookieOptions);
}

function clearAuthCookie(res: express.Response) {
  res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
}

async function issueAuthTokens(user: any, req: express.Request, res: express.Response) {
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id);
  const refreshHash = hashToken(refreshToken);

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
    },
  });

  setAuthCookie(res, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    },
  };
}

app.post('/api/auth/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (existing) {
      return res.status(409).json(createError('This email is already registered.'));
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const token = makeRandomToken();

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        mobile: payload.mobile,
        passwordHash,
        role: payload.role,
        status: 'PENDING',
        emailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const studentId = `FWL-STU-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    if (payload.role === 'STUDENT') {
      await prisma.student.create({
        data: {
          userId: user.id,
          studentId,
          classId: 'pending',
          section: 'A',
        },
      });
    }

    return res.status(201).json(createSuccess({ userId: user.id }, 'Registration successful. Please verify your email.'));
  } catch (error: any) {
    return res.status(400).json(createError(error.message || 'Registration failed.', 'VALIDATION_ERROR'));
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });

    if (!user) {
      return res.status(401).json(createError('Invalid email or password.', 'INVALID_CREDENTIALS'));
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json(createError('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED'));
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json(createError('Your account is currently inactive. Please contact the administrator.', 'ACCOUNT_INACTIVE'));
    }

    const valid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!valid) {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: user.failedLoginAttempts + 1, lastFailedLoginAt: new Date() } });
      return res.status(401).json(createError('Invalid email or password.', 'INVALID_CREDENTIALS'));
    }

    if (!user.emailVerified) {
      return res.status(403).json(createError('Please verify your email before continuing.', 'EMAIL_NOT_VERIFIED'));
    }

    const tokens = await issueAuthTokens(user, req, res);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), failedLoginAttempts: 0 } });

    return res.json(createSuccess({ user: tokens.user, accessToken: tokens.accessToken }, 'Login successful'));
  } catch (error: any) {
    return res.status(400).json(createError(error.message || 'Login failed.', 'VALIDATION_ERROR'));
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (token) {
    const hash = hashToken(token);
    await prisma.refreshSession.updateMany({ where: { refreshTokenHash: hash }, data: { revokedAt: new Date() } });
  }
  clearAuthCookie(res);
  return res.json(createSuccess({}, 'Logged out successfully'));
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json(createError('Unauthorized.', 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(401).json(createError('Unauthorized.', 'UNAUTHORIZED'));
    }

    return res.json(createSuccess({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    }));
  } catch {
    return res.status(401).json(createError('Unauthorized.', 'UNAUTHORIZED'));
  }
});

app.post('/api/auth/forgot-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.json(createSuccess({}, 'If an account exists with this email, a password reset link has been sent.'));
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    const token = makeRandomToken();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  return res.json(createSuccess({}, 'If an account exists with this email, a password reset link has been sent.'));
});

app.post('/api/auth/reset-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json(createError('Invalid reset request.', 'INVALID_REQUEST'));
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json(createError('Password reset token is invalid or expired.', 'INVALID_TOKEN'));
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      status: user.status === 'PENDING' ? 'PENDING' : user.status,
    },
  });

  return res.json(createSuccess({}, 'Password reset successful.'));
});

app.post('/api/auth/verify-email', async (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json(createError('Missing verification token.', 'INVALID_TOKEN'));
  }

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json(createError('Verification token is invalid or expired.', 'INVALID_TOKEN'));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      status: 'ACTIVE',
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  return res.json(createSuccess({}, 'Email verified successfully.'));
});

app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'Fun With Learn Auth API' }));

app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
