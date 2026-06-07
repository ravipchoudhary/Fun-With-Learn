export type UserRole = 'student' | 'teacher' | 'admin';

export type ClassLevel = 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

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
  watchProgress: number; // percentage
  duration: string;
  views: number;
  thumbnail: string;
  description: string;
  classLevel: ClassLevel;
  videoUrl: string;
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
  progress: number; // percentage overall learning
  completedHours: number;
  totalXP: number;
  classLevel?: ClassLevel;
}
