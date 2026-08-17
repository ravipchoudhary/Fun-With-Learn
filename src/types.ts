export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export type SchoolClassLevel =
  | 'Nursery'
  | 'LKG'
  | 'UKG'
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export type ClassLevel = SchoolClassLevel;

export interface Course {
  id: string;
  name: string;
  thumbnail: string;
  teacherName: string;
  duration: string;
  studentsEnrolled: number;
  price: number;
  rating: number;
  classLevel: ClassLevel;
  subject: string;
  description: string;
}

export interface LiveClass {
  id: string;
  title: string;
  teacherName: string;
  timing: string;
  timingFormatted: string;
  status: 'ongoing' | 'upcoming';
  subject: string;
  classLevel: ClassLevel;
  enrolledCount: number;
  description: string;
  meetingId: string;
}

export interface RecordedVideo {
  id: string;
  title: string;
  category: string;
  teacherName: string;
  watchProgress: number;
  duration: string;
  views: number;
  thumbnail: string;
  description: string;
  classLevel: ClassLevel;
  videoUrl: string;
}

export interface SubjectChapter {
  id: string;
  name: string;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  lessonType: string;
}

export interface SubjectModule {
  id: string;
  name: string;
  icon: string;
  chapters: SubjectChapter[];
  completedChapters: number;
  totalChapters: number;
  progress: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: string;
  chapter: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Late' | 'Completed';
  marks: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  classLevel: ClassLevel;
  timeLimit: number;
  questions: QuizQuestion[];
}

export interface TestItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  classLevel: ClassLevel;
  totalMarks: number;
  timeLimit: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  color: string;
  badge?: string;
  paymentButtonId?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  subscriptionPlan: 'Basic' | 'Standard' | 'Premium' | 'None';
  progress: number;
  completedHours: number;
  totalXP: number;
  classLevel?: ClassLevel;
}
