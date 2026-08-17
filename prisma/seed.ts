import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      mobile: '9999999999',
      passwordHash: demoPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      name: 'Teacher User',
      email: 'teacher@example.com',
      mobile: '8888888888',
      passwordHash: demoPassword,
      role: 'TEACHER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@example.com',
      mobile: '7777777777',
      passwordHash: demoPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const parent = await prisma.user.upsert({
    where: { email: 'parent@example.com' },
    update: {},
    create: {
      name: 'Parent User',
      email: 'parent@example.com',
      mobile: '6666666666',
      passwordHash: demoPassword,
      role: 'PARENT',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacher.id },
    update: {},
    create: { userId: teacher.id, teacherId: 'FWL-TEA-000001', qualification: 'M.Ed', bio: 'Demo teacher account.' },
  });

  await prisma.student.upsert({
    where: { userId: student.id },
    update: {},
    create: { userId: student.id, studentId: 'FWL-STU-000001', classId: 'class-5', section: 'A' },
  });

  await prisma.parent.upsert({
    where: { userId: parent.id },
    update: {},
    create: { userId: parent.id },
  });

  // Create Teacher record if not exists
  const teacherRecord = await prisma.teacher.upsert({
    where: { userId: teacher.id },
    update: {},
    create: { userId: teacher.id, teacherId: 'FWL-TEA-000001', qualification: 'M.Ed', bio: 'Demo teacher account.' },
  });

  // Create Student record if not exists
  const studentRecord = await prisma.student.upsert({
    where: { userId: student.id },
    update: {},
    create: { userId: student.id, studentId: 'FWL-STU-000001', classId: 'class-5', section: 'A' },
  });

  // Create LMS Classes
  const class5 = await prisma.class.upsert({
    where: { name: 'Class 5' },
    update: {},
    create: {
      name: 'Class 5',
      level: 'Class 5',
      description: 'Foundation course for Class 5 students',
      teacherId: teacherRecord.id,
    },
  });

  const class10 = await prisma.class.upsert({
    where: { name: 'Class 10' },
    update: {},
    create: {
      name: 'Class 10',
      level: 'Class 10',
      description: 'Science and Mathematics for Class 10',
      teacherId: teacherRecord.id,
    },
  });

  // Create Subjects for Class 5
  const math5 = await prisma.subject.upsert({
    where: { name_classId: { name: 'Mathematics', classId: class5.id } },
    update: {},
    create: {
      name: 'Mathematics',
      classId: class5.id,
      description: 'Basic mathematics concepts and problem solving',
    },
  });

  const english5 = await prisma.subject.upsert({
    where: { name_classId: { name: 'English', classId: class5.id } },
    update: {},
    create: {
      name: 'English',
      classId: class5.id,
      description: 'Language skills and comprehension',
    },
  });

  // Create Subjects for Class 10
  const math10 = await prisma.subject.upsert({
    where: { name_classId: { name: 'Mathematics', classId: class10.id } },
    update: {},
    create: {
      name: 'Mathematics',
      classId: class10.id,
      description: 'Advanced mathematics including algebra and geometry',
    },
  });

  const science10 = await prisma.subject.upsert({
    where: { name_classId: { name: 'Science', classId: class10.id } },
    update: {},
    create: {
      name: 'Science',
      classId: class10.id,
      description: 'Physics, Chemistry, and Biology',
    },
  });

  // Create Chapters for Math Class 5
  const chapter1 = await prisma.chapter.upsert({
    where: { name_subjectId: { name: 'Numbers and Place Value', subjectId: math5.id } },
    update: {},
    create: {
      name: 'Numbers and Place Value',
      subjectId: math5.id,
      description: 'Understanding numbers, counting, and place values',
    },
  });

  const chapter2 = await prisma.chapter.upsert({
    where: { name_subjectId: { name: 'Basic Arithmetic', subjectId: math5.id } },
    update: {},
    create: {
      name: 'Basic Arithmetic',
      subjectId: math5.id,
      description: 'Addition, subtraction, multiplication, and division',
    },
  });

  // Create Topics for Chapters
  await prisma.topic.upsert({
    where: { id: 'topic-1-1' },
    update: {},
    create: {
      id: 'topic-1-1',
      name: 'Introduction to Numbers',
      chapterId: chapter1.id,
      content: 'Learn the basics of numbers from 1 to 100',
      duration: 15,
    },
  });

  await prisma.topic.upsert({
    where: { id: 'topic-1-2' },
    update: {},
    create: {
      id: 'topic-1-2',
      name: 'Place Value System',
      chapterId: chapter1.id,
      content: 'Understanding ones, tens, and hundreds',
      duration: 20,
    },
  });

  // Create Enrollment for demo student in Class 5
  const enrollment = await prisma.enrollment.upsert({
    where: { studentId_classId: { studentId: studentRecord.id, classId: class5.id } },
    update: {},
    create: {
      studentId: studentRecord.id,
      classId: class5.id,
      status: 'ACTIVE',
    },
  });

  // Create Student Progress
  await prisma.studentProgress.upsert({
    where: { enrollmentId: enrollment.id },
    update: {},
    create: {
      enrollmentId: enrollment.id,
      totalAssignments: 5,
      completedAssignments: 3,
      totalTests: 2,
      passedTests: 1,
      averageScore: 78.5,
      totalHoursSpent: 12,
    },
  });

  // Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Practice Addition Problems',
      description: 'Solve 20 addition problems involving numbers up to 100',
      subjectId: math5.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalMarks: 20,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Reading Comprehension Task',
      description: 'Read the story and answer the questions',
      subjectId: english5.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      totalMarks: 25,
    },
  });

  // Create Assignment Submissions
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentRecord.id,
      status: 'GRADED',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      marks: 18,
      feedback: 'Great work! Only 2 small mistakes.',
    },
  });

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment2.id,
      studentId: studentRecord.id,
      status: 'IN_PROGRESS',
      submittedAt: null,
      marks: null,
      feedback: null,
    },
  });

  // Create Quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Numbers Quiz - Chapter 1',
      description: 'Test your understanding of numbers and place value',
      subjectId: math5.id,
      timeLimit: 30,
      totalQuestions: 10,
      totalMarks: 10,
    },
  });

  // Create Quiz Attempts
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      studentId: studentRecord.id,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
      marksObtained: 9,
      percentage: 90,
    },
  });

  // Create Tests
  const test1 = await prisma.test.create({
    data: {
      title: 'Mid-Term Math Exam',
      description: 'Comprehensive test covering Chapters 1-3',
      subjectId: math5.id,
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      duration: 60,
      totalMarks: 100,
    },
  });

  // Create Test Attempts
  await prisma.testAttempt.create({
    data: {
      testId: test1.id,
      studentId: studentRecord.id,
      status: 'NOT_STARTED',
      startedAt: null,
      completedAt: null,
      marksObtained: null,
      percentage: null,
    },
  });

  console.log('Demo LMS seed complete!', {
    admin: admin.email,
    teacher: teacher.email,
    student: student.email,
    parent: parent.email,
    password: 'Admin@123',
    classes: [class5.name, class10.name],
    subjects: [math5.name, english5.name, math10.name, science10.name],
    enrollment: `${studentRecord.studentId} → ${class5.name}`,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
