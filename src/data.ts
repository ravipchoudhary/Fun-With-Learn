import { Course, LiveClass, RecordedVideo, SubscriptionPlan, ClassLevel } from './types';

export const CLASS_LEVELS: ClassLevel[] = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

export const LMS_CLASS_STRUCTURE: Record<string, { id: string; name: string; icon: string; chapters: any[]; completedChapters: number; totalChapters: number; progress: number }[]> = {
  'Class 5': [
    {
      id: 'math-5',
      name: 'Mathematics',
      icon: '∑',
      chapters: [
        { id: 'c1', name: 'Numbers', progress: 80, completedTopics: 8, totalTopics: 10, lessonType: 'Practice' },
        { id: 'c2', name: 'Fractions', progress: 72, completedTopics: 7, totalTopics: 10, lessonType: 'Quiz' },
        { id: 'c3', name: 'Decimals', progress: 64, completedTopics: 6, totalTopics: 10, lessonType: 'Video' },
        { id: 'c4', name: 'Geometry', progress: 58, completedTopics: 5, totalTopics: 9, lessonType: 'Activity' },
        { id: 'c5', name: 'Measurement', progress: 76, completedTopics: 7, totalTopics: 9, lessonType: 'Test' }
      ],
      completedChapters: 3,
      totalChapters: 5,
      progress: 70
    },
    {
      id: 'science-5',
      name: 'Science',
      icon: '🔬',
      chapters: [
        { id: 's1', name: 'Plants', progress: 84, completedTopics: 8, totalTopics: 10, lessonType: 'Learn' },
        { id: 's2', name: 'Human Body', progress: 60, completedTopics: 6, totalTopics: 10, lessonType: 'Quiz' },
        { id: 's3', name: 'Air & Water', progress: 74, completedTopics: 7, totalTopics: 9, lessonType: 'Test' }
      ],
      completedChapters: 2,
      totalChapters: 3,
      progress: 73
    },
    {
      id: 'english-5',
      name: 'English',
      icon: '📘',
      chapters: [
        { id: 'e1', name: 'Grammar', progress: 78, completedTopics: 7, totalTopics: 9, lessonType: 'Practice' },
        { id: 'e2', name: 'Comprehension', progress: 68, completedTopics: 6, totalTopics: 9, lessonType: 'Learn' }
      ],
      completedChapters: 1,
      totalChapters: 2,
      progress: 71
    }
  ],
  'Class 10': [
    {
      id: 'math-10',
      name: 'Mathematics',
      icon: '∑',
      chapters: [
        { id: 'm1', name: 'Real Numbers', progress: 82, completedTopics: 11, totalTopics: 13, lessonType: 'Learn' },
        { id: 'm2', name: 'Polynomials', progress: 76, completedTopics: 9, totalTopics: 12, lessonType: 'Quiz' },
        { id: 'm3', name: 'Triangles', progress: 70, completedTopics: 8, totalTopics: 11, lessonType: 'Video' },
        { id: 'm4', name: 'Trigonometry', progress: 69, completedTopics: 10, totalTopics: 14, lessonType: 'Test' }
      ],
      completedChapters: 3,
      totalChapters: 4,
      progress: 74
    },
    {
      id: 'science-10',
      name: 'Science',
      icon: '🔬',
      chapters: [
        { id: 'sc1', name: 'Chemical Reactions', progress: 88, completedTopics: 9, totalTopics: 10, lessonType: 'Learn' },
        { id: 'sc2', name: 'Light', progress: 73, completedTopics: 7, totalTopics: 9, lessonType: 'Practice' },
        { id: 'sc3', name: 'Life Processes', progress: 69, completedTopics: 8, totalTopics: 11, lessonType: 'Video' }
      ],
      completedChapters: 2,
      totalChapters: 3,
      progress: 77
    },
    {
      id: 'social-10',
      name: 'Social Science',
      icon: '🌍',
      chapters: [
        { id: 'ss1', name: 'Nationalism', progress: 68, completedTopics: 7, totalTopics: 10, lessonType: 'Learn' },
        { id: 'ss2', name: 'Resources', progress: 72, completedTopics: 8, totalTopics: 10, lessonType: 'Quiz' }
      ],
      completedChapters: 1,
      totalChapters: 2,
      progress: 70
    }
  ],
  'Class 12': [
    {
      id: 'physics-12',
      name: 'Physics',
      icon: '⚡',
      chapters: [
        { id: 'p1', name: 'Electrostatics', progress: 85, completedTopics: 9, totalTopics: 10, lessonType: 'Learn' },
        { id: 'p2', name: 'Current Electricity', progress: 80, completedTopics: 8, totalTopics: 10, lessonType: 'Video' },
        { id: 'p3', name: 'Ray Optics', progress: 66, completedTopics: 7, totalTopics: 11, lessonType: 'Practice' }
      ],
      completedChapters: 2,
      totalChapters: 3,
      progress: 77
    },
    {
      id: 'maths-12',
      name: 'Mathematics',
      icon: '∑',
      chapters: [
        { id: 'm12-1', name: 'Integrals', progress: 76, completedTopics: 8, totalTopics: 10, lessonType: 'Quiz' },
        { id: 'm12-2', name: 'Differentiation', progress: 83, completedTopics: 9, totalTopics: 10, lessonType: 'Video' }
      ],
      completedChapters: 1,
      totalChapters: 2,
      progress: 80
    }
  ]
};

export const STUDENT_ASSIGNMENTS: any[] = [
  { id: 'a1', title: 'Fractions Practice Sheet', classLevel: 'Class 5', subject: 'Mathematics', chapter: 'Fractions', dueDate: '2026-08-18', status: 'Pending', marks: 20 },
  { id: 'a2', title: 'Chemical Reactions Worksheet', classLevel: 'Class 10', subject: 'Science', chapter: 'Chemical Reactions', dueDate: '2026-08-16', status: 'Submitted', marks: 25 },
  { id: 'a3', title: 'Electrostatics Assignment', classLevel: 'Class 12', subject: 'Physics', chapter: 'Electrostatics', dueDate: '2026-08-20', status: 'Late', marks: 30 }
];

export const STUDENT_QUIZZES: any[] = [
  {
    id: 'q1',
    title: 'Fractions Quick Quiz',
    subject: 'Mathematics',
    chapter: 'Fractions',
    classLevel: 'Class 5',
    timeLimit: 15,
    questions: [
      { id: 'q1-1', question: '1/2 + 1/2 = ?', options: ['1', '1/4', '2', '1/3'], answer: '1', explanation: 'When numerators are equal and denominators same, sum them.' },
      { id: 'q1-2', question: 'Which is greater: 3/4 or 2/3?', options: ['3/4', '2/3', 'Equal', 'Cannot compare'], answer: '3/4', explanation: '3/4 = 0.75 and 2/3 = 0.66.' }
    ]
  }
];

export const STUDENT_TESTS: any[] = [
  { id: 't1', title: 'Chapter Test: Real Numbers', subject: 'Mathematics', chapter: 'Real Numbers', classLevel: 'Class 10', totalMarks: 40, timeLimit: 45 }
];

export const TODAY_CLASSES = [
  { subject: 'Mathematics', teacher: 'Dr. Ramesh Sharma', topic: 'Quadratic Equations', date: 'Today', startTime: '09:30 AM', endTime: '10:10 AM', status: 'Live Now' },
  { subject: 'Science', teacher: 'Prof. Neha Gupta', topic: 'Chemical Reactions', date: 'Today', startTime: '11:00 AM', endTime: '11:45 AM', status: 'Upcoming' },
  { subject: 'English', teacher: 'Sarah Jenkins', topic: 'Grammar Correction', date: 'Today', startTime: '02:00 PM', endTime: '02:40 PM', status: 'Completed' }
];

export const STUDENT_PROGRESS = {
  overall: 76,
  subjectWise: [
    { name: 'Mathematics', value: 82 },
    { name: 'Science', value: 77 },
    { name: 'English', value: 71 },
    { name: 'Social Science', value: 68 }
  ],
  chapterWise: [
    { name: 'Numbers', value: 88 },
    { name: 'Fractions', value: 70 },
    { name: 'Geometry', value: 63 },
    { name: 'Measurement', value: 81 }
  ]
};

export const MOCK_REVIEWS = [
  {
    name: 'Rohan Deshmukh',
    role: 'Class 10 Student',
    text: 'Dr. Ramesh Sharma\'s math classes made quadratic equations feel like a game! The AI chatbot helped me clear doubts at 11 PM.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Suhani Malhotra',
    role: 'Class 12 Student',
    text: 'The interactive WebRTC classrooms let us speak directly with the teacher. I got 98% in my Board exams thanks to physics lectures.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Harish Kumar',
    role: 'Parent of Class 8 Student',
    text: 'The progress dashboard keeps us updated on completed hours and overall test ratings. Best online platform and and very easy to navigate!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Advanced Mathematics: Foundations & Algebra',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Dr. Ramesh Sharma',
    duration: '45 Hours',
    studentsEnrolled: 1450,
    price: 1999,
    rating: 4.8,
    classLevel: 'Class 10',
    subject: 'Mathematics',
    description: 'Master quadratic equations, progressions, trigonometry, and surface areas with hand-picked practice papers.'
  },
  {
    id: 'course-2',
    name: 'Physics: Mechanics & Wave Motion',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Prof. Neha Gupta',
    duration: '60 Hours',
    studentsEnrolled: 2100,
    price: 2499,
    rating: 4.9,
    classLevel: 'Class 12',
    subject: 'Physics',
    description: 'Comprehensive preparation for high school boards and entrance tests focusing on fluid mechanics and kinematics.'
  },
  {
    id: 'course-3',
    name: 'Introductory Chemistry: Atoms and Molecules',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Dr. Vivek Mishra',
    duration: '30 Hours',
    studentsEnrolled: 840,
    price: 1499,
    rating: 4.6,
    classLevel: 'Class 8',
    subject: 'Chemistry',
    description: 'A fun, experimental guide to chemical reactions, elements, acids, bases, and properties of matter.'
  },
  {
    id: 'course-4',
    name: 'Biology Foundations: Genetics & Heredity',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Ananya Roy (M.Sc)',
    duration: '38 Hours',
    studentsEnrolled: 1120,
    price: 1899,
    rating: 4.7,
    classLevel: 'Class 9',
    subject: 'Biology',
    description: 'Unravel the mysteries of DNA mutations, cell structures, cell division, and evolutionary biology.'
  },
  {
    id: 'course-5',
    name: 'Interactive English Comprehension',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Sarah Jenkins',
    duration: '22 Hours',
    studentsEnrolled: 560,
    price: 999,
    rating: 4.5,
    classLevel: 'Class 6',
    subject: 'English',
    description: 'Enhance your spoken and written english skills. Covers advanced grammar rules, essay writing, and poetry.'
  },
  {
    id: 'course-6',
    name: 'History of Modern India',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Amit Verma',
    duration: '40 Hours',
    studentsEnrolled: 980,
    price: 1299,
    rating: 4.7,
    classLevel: 'Class 11',
    subject: 'History',
    description: 'Dive deep into the Indian national movement, constitutional reforms, and cultural evolutions.'
  },
  {
    id: 'course-7',
    name: 'Computer Science: Programming in Python',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600',
    teacherName: 'Vikram Aditya',
    duration: '50 Hours',
    studentsEnrolled: 3100,
    price: 2999,
    rating: 4.9,
    classLevel: 'Class 11',
    subject: 'Computer Science',
    description: 'Step-by-step guidance on Python coding, object-oriented concepts, database structures, and simple algorithms.'
  }
];

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    title: 'Kinematics and Friction - Live Concepts + Q&A',
    teacherName: 'Prof. Neha Gupta',
    timing: '2026-06-07T09:30:00Z',
    timingFormatted: 'Today at 09:30 AM (In progress soon)',
    status: 'ongoing',
    subject: 'Physics',
    classLevel: 'Class 12',
    enrolledCount: 342,
    description: 'Interactive session exploring friction coefficients, relative motions, and free-body diagrams.',
    meetingId: 'room-physics-12'
  },
  {
    id: 'live-2',
    title: 'Calculus Hacks for Scoring 100% in Boards',
    teacherName: 'Dr. Ramesh Sharma',
    timing: '2026-06-07T11:00:00Z',
    timingFormatted: 'Today at 11:00 AM',
    status: 'upcoming',
    subject: 'Mathematics',
    classLevel: 'Class 12',
    enrolledCount: 521,
    description: 'Unlock super fast tricks to solve derivative integrations, limits, and continuous functions.',
    meetingId: 'room-math-calculus'
  },
  {
    id: 'live-3',
    title: 'The Periodic Table Uncoded: Mendeleev to Modern',
    teacherName: 'Dr. Vivek Mishra',
    timing: '2026-06-07T14:30:00Z',
    timingFormatted: 'Today at 02:30 PM',
    status: 'upcoming',
    subject: 'Chemistry',
    classLevel: 'Class 10',
    enrolledCount: 180,
    description: 'An engaging approach to learning elements grouping, electron shells, and transition elements behavior.',
    meetingId: 'room-chemistry-periodic'
  },
  {
    id: 'live-4',
    title: 'Cell division & Mitosis vs Meiosis Essentials',
    teacherName: 'Ananya Roy (M.Sc)',
    timing: '2026-06-08T10:00:00Z',
    timingFormatted: 'Tomorrow at 10:00 AM',
    status: 'upcoming',
    subject: 'Biology',
    classLevel: 'Class 9',
    enrolledCount: 112,
    description: 'A visual class with immersive 3D mockups explaining chromosome movements and replication.',
    meetingId: 'room-biology-cells'
  }
];

export const INITIAL_RECORDED_VIDEOS: RecordedVideo[] = [
  {
    id: 'rec-1',
    title: 'Introduction to Electrostatics and Charges',
    category: 'Physics',
    teacherName: 'Prof. Neha Gupta',
    watchProgress: 75,
    duration: '45 mins',
    views: 12050,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500',
    description: 'Learn the core principles of Coulomb\'s law, electric field mapping, and static discharges.',
    classLevel: 'Class 12',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'rec-2',
    title: 'Trigonometric Identities Made Easy',
    category: 'Mathematics',
    teacherName: 'Dr. Ramesh Sharma',
    watchProgress: 35,
    duration: '62 mins',
    views: 18400,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=500',
    description: 'Simplifying sin/cos identities, coordinate divisions, and solving complex boards formulas.',
    classLevel: 'Class 10',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  },
  {
    id: 'rec-3',
    title: 'Acids, Bases & Salts - Practical Demonstrations',
    category: 'Chemistry',
    teacherName: 'Dr. Vivek Mishra',
    watchProgress: 10,
    duration: '38 mins',
    views: 9320,
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=500',
    description: 'Visualizing color changes of litmus solutions and reaction of strong acids with metals.',
    classLevel: 'Class 10',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4'
  },
  {
    id: 'rec-4',
    title: 'Human Circulatory System Complete Breakdown',
    category: 'Biology',
    teacherName: 'Ananya Roy (M.Sc)',
    watchProgress: 0,
    duration: '50 mins',
    views: 6540,
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=500',
    description: 'Master the chamber actions of the human heart, blood routing parameters, and vascular functions.',
    classLevel: 'Class 9',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'rec-5',
    title: 'English Grammar - Prepositions & Modals',
    category: 'English',
    teacherName: 'Sarah Jenkins',
    watchProgress: 100,
    duration: '30 mins',
    views: 11400,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500',
    description: 'Detailed analysis of basic connectors, modifiers, modal verbs in standard active conversations.',
    classLevel: 'Class 6',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basic Plan',
    price: 499,
    period: 'month',
    features: [
      'Ad-free access to Recorded Video Library',
      'Class 6 to 10 course modules',
      'Daily Practice Papers (PDF download)',
      'Basic Performance Report cards',
      'Standard community chat rooms access'
    ],
    color: 'border-slate-200 bg-white dark:bg-slate-900',
    paymentButtonId: 'razorpay-basic'
  },
  {
    id: 'plan_standard',
    name: 'Standard Plan',
    price: 999,
    period: 'month',
    features: [
      'All Basic Plan benefits + Senior Grades (Class 11 & 12)',
      'Access to Interactive Daily Live Classes',
      'Real-time doubt answering with live chats',
      'Post-class quiz challenges & XP credentials',
      'Live leaderboards & progress trackers'
    ],
    color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-indigo-100/50 dark:shadow-none',
    badge: 'Popular',
    paymentButtonId: 'razorpay-standard'
  },
  {
    id: 'plan_premium',
    name: 'Premium Plan',
    price: 1999,
    period: 'month',
    features: [
      'All Standard Plan benefits + Priority Support',
      '1-on-1 Peer Video Calling & Instant Tutors',
      'Interactive WebRTC screen sharing access',
      'Customized AI Learning Path generator',
      'Personalized WhatsApp doubt solver chatbot',
      'DRM protected certified recordings downloads'
    ],
    color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-purple-100/50 dark:shadow-none',
    badge: 'Best Value',
    paymentButtonId: 'razorpay-premium'
  }
];

export const GENERAL_FAQS = [
  {
    question: 'How do I start attending live interactive classes?',
    answer: 'Once you subscribe to a Standard or Premium Plan, go to the "Live Classes" page. Click the "Join Live" button on any active stream to join the WebRTC interactive video feed and chat real-time.'
  },
  {
    question: 'Can I resume watching recorded video lectures across devices?',
    answer: 'Yes! Fun With Learn tracking is backed up in local session state. When you resume on any device, the progress tracker lets you continue right where you left off.'
  },
  {
    question: 'How does the Gemini AI Learning Assistant help me?',
    answer: 'Our AI engine recommends matching courses or custom-curates a revision roadmap. You can ask doubts about complex mathematical problems or ask for essay revisions inside the Student Chatbot panel.'
  },
  {
    question: 'Does this platform support role-based dashboards?',
    answer: 'Yes! Teachers have a special portal under the "Teacher Portal" tab to schedule live sessions, upload recorded lectures, and view student progress. Admins can view analytics, manage students, inspect revenue, and review logs.'
  },
  {
    question: 'Is there a simulated payment flow integrated?',
    answer: 'Yes, each subscription plan has an integrated Razorpay mock checkout dialog. It collects student credentials and instantly updates the account tier state to let you test Premium capabilities.'
  }
];
