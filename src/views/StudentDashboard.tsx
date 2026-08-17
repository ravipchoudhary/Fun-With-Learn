import React, { useState, useEffect } from 'react';
import { Award, Clock, Flame, BookOpen, Bell, Sparkles, Filter, ChevronRight, CheckCircle, Brain, RefreshCw, CalendarCheck2, NotebookText, CircleDashed, BarChart3 } from 'lucide-react';
import { UserProfile, Course } from '../types';
import { LMS_CLASS_STRUCTURE, STUDENT_ASSIGNMENTS, STUDENT_QUIZZES, STUDENT_TESTS, TODAY_CLASSES, STUDENT_PROGRESS } from '../data';

interface StudentDashboardProps {
  profile: UserProfile;
  setProfile: (p: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  purchasedCourses: Course[];
  onTabChange: (tabId: string) => void;
  notifications: string[];
  clearNotifications: () => void;
  summary?: any;
}

export default function StudentDashboard({
  profile,
  setProfile,
  purchasedCourses,
  onTabChange,
  notifications,
  clearNotifications,
  summary,
}: StudentDashboardProps) {
  // Adaptive AI states
  const [aiInterest, setAiInterest] = useState('Science');
  const [currentScore, setCurrentScore] = useState('75%');
  const [aiRecResult, setAiRecResult] = useState<any[] | null>(null);
  const [aiRecLoading, setAiRecLoading] = useState(false);

  const [aiSubjectPath, setAiSubjectPath] = useState('Physics');
  const [aiPathResult, setAiPathResult] = useState<any | null>(null);
  const [aiPathLoading, setAiPathLoading] = useState(false);

  // Real LMS data states
  const [lmsData, setLmsData] = useState<any>({
    enrolledClasses: [],
    assignments: [],
    progress: null,
    quizzes: [],
    tests: [],
  });
  const [lmsLoading, setLmsLoading] = useState(true);

  // Fetch real LMS data from backend
  useEffect(() => {
    async function fetchLmsData() {
      try {
        const [classesRes, assignmentsRes, progressRes, quizzesRes, testsRes] = await Promise.all([
          fetch('/api/student/classes', { credentials: 'include' }),
          fetch('/api/student/assignments', { credentials: 'include' }),
          fetch('/api/student/progress', { credentials: 'include' }),
          fetch('/api/student/quizzes', { credentials: 'include' }),
          fetch('/api/student/tests', { credentials: 'include' }),
        ]);

        if (classesRes.ok && assignmentsRes.ok && progressRes.ok && quizzesRes.ok && testsRes.ok) {
          const [classesData, assignmentsData, progressData, quizzesData, testsData] = await Promise.all([
            classesRes.json(),
            assignmentsRes.json(),
            progressRes.json(),
            quizzesRes.json(),
            testsRes.json(),
          ]);

          setLmsData({
            enrolledClasses: classesData.data?.enrolledClasses || [],
            assignments: assignmentsData.data?.assignments || [],
            progress: progressData.data?.progress || null,
            quizzes: quizzesData.data?.quizzes || [],
            tests: testsData.data?.tests || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch LMS data:', err);
      } finally {
        setLmsLoading(false);
      }
    }

    fetchLmsData();
  }, []);

  // Trigger expressive recommendation calls
  const handleFetchAiRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiRecLoading(true);
    try {
      const response = await fetch('/api/ai/recommend-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: profile.classLevel || 'Class 10',
          interest: aiInterest,
          currentScore: currentScore,
        }),
      });
      const data = await response.json();
      setAiRecResult(data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAiRecLoading(false);
    }
  };

  // Trigger expressive path custom formulation
  const handleFetchAiPath = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiPathLoading(true);
    try {
      const response = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: profile.classLevel || 'Class 12',
          subject: aiSubjectPath,
          currentScore: currentScore,
        }),
      });
      const data = await response.json();
      setAiPathResult(data.path || null);
    } catch (err) {
      console.error(err);
    } finally {
      setAiPathLoading(false);
    }
  };

  const summaryProfile = summary?.profile || profile;
  const activeClassLevel = summaryProfile.classLevel || profile.classLevel || 'Class 10';
  const subjects = summary?.subjects || LMS_CLASS_STRUCTURE[activeClassLevel] || LMS_CLASS_STRUCTURE['Class 10'];
  const upcomingClasses = summary?.upcomingClasses || TODAY_CLASSES;
  
  // Use real LMS data with fallback to mock data
  const progressData = summary?.progress || lmsData.progress || STUDENT_PROGRESS;
  const assignmentData = summary?.assignments || lmsData.assignments || STUDENT_ASSIGNMENTS;
  const quizData = summary?.quizzes || lmsData.quizzes || STUDENT_QUIZZES;
  const testData = summary?.tests || lmsData.tests || STUDENT_TESTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Header greeting frame */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-950 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Welcome back Student!</span>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-none">
            {summaryProfile.name || profile.name}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm">Grade Group: {summaryProfile.role || profile.role} • Registered plan: <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-350 font-bold px-2 py-0.5 rounded text-[10px]">{summaryProfile.subscriptionPlan || profile.subscriptionPlan} Tier</span></p>
        </div>

        {/* Gamified Stat panels */}
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <div className="text-center bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm min-w-[100px]">
            <Flame className="text-orange-500 mx-auto" size={20} />
            <span className="block font-sans font-black text-slate-900 dark:text-white text-base mt-1">4 Days</span>
            <span className="block text-[9px] text-slate-400 uppercase tracking-wide">Daily Streak</span>
          </div>
          <div className="text-center bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm min-w-[100px]">
            <Award className="text-purple-500 mx-auto" size={20} />
            <span className="block font-sans font-black text-slate-900 dark:text-white text-base mt-1">{summaryProfile.totalXP || profile.totalXP}</span>
            <span className="block text-[9px] text-slate-400 uppercase tracking-wide">Study XP</span>
          </div>
          <div className="text-center bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm min-w-[100px]">
            <Clock className="text-indigo-500 mx-auto" size={20} />
            <span className="block font-sans font-black text-slate-900 dark:text-white text-base mt-1">{summaryProfile.completedHours || profile.completedHours} hrs</span>
            <span className="block text-[9px] text-slate-400 uppercase tracking-wide">Total Watched</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 font-bold">Class Learning Overview</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">{activeClassLevel} Learning Hub</h2>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black">{profile.name.split(' ').map(part => part[0]).slice(0,2).join('').toUpperCase()}</div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{summaryProfile.name || profile.name}</div>
                <div className="text-[10px] text-slate-500">{activeClassLevel} • Student</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {upcomingClasses.map((item, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wide text-indigo-600 dark:text-indigo-400">{item.subject}</span>
                  <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${item.status === 'Live Now' ? 'bg-red-100 text-red-600' : item.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{item.topic}</div>
                <div className="text-[11px] text-slate-500 mt-2">Teacher: {item.teacher}</div>
                <div className="text-[11px] text-slate-500">{item.date} • {item.startTime} - {item.endTime}</div>
                <button className="mt-3 inline-flex items-center justify-center w-full rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-bold py-2.5 cursor-pointer">
                  {item.status === 'Live Now' ? '🔴 LIVE NOW – Join Class' : 'View Class'}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">My Subjects</h3>
              <span className="text-[10px] uppercase text-slate-500">{subjects.length} subjects</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl flex items-center justify-center text-white">{subject.icon}</div>
                      <div>
                        <div className="font-black text-slate-900 dark:text-white text-sm">{subject.name}</div>
                        <div className="text-[10px] text-slate-500">{subject.completedChapters}/{subject.totalChapters} chapters completed</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{subject.progress}%</div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${subject.progress}%` }} />
                  </div>
                  <div className="space-y-2">
                    {subject.chapters.slice(0, 3).map((chapter) => (
                      <div key={chapter.id} className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300">
                        <span>{chapter.name}</span>
                        <span>{chapter.progress}%</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[10px] cursor-pointer">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Progress Snapshot</h3>
              <BarChart3 className="text-indigo-500" size={16} />
            </div>
            <div className="space-y-3">
              {progressData.subjectWise.map((row: any) => (
                <div key={row.name}>
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 mb-1">
                    <span>{row.name}</span>
                    <span>{row.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">Assignments & Tests</h3>
            <div className="space-y-3">
              {assignmentData.map((assignment: any) => (
                <div key={assignment.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{assignment.title}</div>
                    <span className="text-[9px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{assignment.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{assignment.subject} • {assignment.chapter}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Learning Path</h3>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Chapter-wise progress</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressData.chapterWise.map((chapter: any) => (
              <div key={chapter.name} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/40">
                <div className="flex justify-between text-[10px] text-slate-500 mb-2">
                  <span>{chapter.name}</span>
                  <span>{chapter.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${chapter.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="font-black text-slate-900 dark:text-white text-lg mb-4">Quiz + Test Access</h3>
          <div className="space-y-3">
            {quizData.map((quiz: any) => (
              <div key={quiz.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/40">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{quiz.title}</div>
                <div className="text-[10px] text-slate-500 mt-1">{quiz.subject} • {quiz.chapter}</div>
                <button className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg cursor-pointer">Start Quiz</button>
              </div>
            ))}
            {testData.map((test: any) => (
              <div key={test.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/40">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{test.title}</div>
                <div className="text-[10px] text-slate-500 mt-1">{test.subject} • {test.chapter}</div>
                <button className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer">Take Test</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid layouts for AI assessments and purchased studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course recommendations and customized Revision Planner */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Course Recommendations Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Gemini AI Subject Recommendation</h3>
                <p className="text-[11px] text-slate-400">Specify your weak areas to let Gemini search matching modules instantly.</p>
              </div>
            </div>

            <form onSubmit={handleFetchAiRecommendations} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Your Weaker Section</label>
                <input 
                  type="text" 
                  value={aiInterest}
                  onChange={(e) => setAiInterest(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2 px-3 text-xs rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Current Score Rating</label>
                <select
                  value={currentScore}
                  onChange={(e) => setCurrentScore(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2 px-3 text-xs rounded-lg focus:outline-none"
                >
                  <option value="60%">Failing / ~60%</option>
                  <option value="75%">Average / ~75%</option>
                  <option value="90%">Excels / ~90%</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={aiRecLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {aiRecLoading ? <RefreshCw className="animate-spin" size={13} /> : 'Fetch AI assessment'}
                </button>
              </div>
            </form>

            {/* Recommendations result */}
            {aiRecResult && (
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Brain size={13} className="text-purple-500" />
                  Gemini Course Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecResult.map((rec, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[9px] font-mono uppercase bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded font-extrabold">{rec.scoreTarget}</span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{rec.title}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Focus: {rec.topic}</p>
                      <p className="text-[10px] text-slate-400 italic font-mono">Reason: {rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Personalized Learning Path Revision Planner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Gemini Personalized Revision path</h3>
                <p className="text-[11px] text-slate-400">Establish a tailored daily revision curriculum based on weaker chapters.</p>
              </div>
            </div>

            <form onSubmit={handleFetchAiPath} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Select Weak Subject</label>
                <select
                  value={aiSubjectPath}
                  onChange={(e) => setAiSubjectPath(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2 px-3 text-xs rounded-lg focus:outline-none"
                >
                  <option value="Physics">Physics mechanics</option>
                  <option value="Mathematics">Algebraic vectors</option>
                  <option value="Chemistry">Organic chemistry</option>
                  <option value="Biology">Genetic mutations</option>
                </select>
              </div>
              <div className="hidden">
                {/* Score inherited from above */}
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={aiPathLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {aiPathLoading ? <RefreshCw className="animate-spin" size={13} /> : 'Generate Personalized Day Plan'}
                </button>
              </div>
            </form>

            {/* Path result breakdown layout */}
            {aiPathResult && (
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                      {aiPathResult.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Timeline: {aiPathResult.estimatedDuration}</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-l-2 border-emerald-500 pl-4 ml-2">
                  {aiPathResult.steps?.map((step: any, sIdx: number) => (
                    <div key={sIdx} className="relative space-y-1">
                      <span className="absolute -left-[25px] top-[2px] h-3 w-3 bg-emerald-500 rounded-full" />
                      <span className="block text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold w-fit">
                        {step.day}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{step.focus}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">Weekly exercise: {step.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Enrolled Active Studies list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">My Course Syllabus Packs ({purchasedCourses.length})</h3>
            
            {purchasedCourses.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <span>📚</span>
                <p className="text-xs text-slate-500">You haven't enrolled in any custom syllabus packs yet.</p>
                <button 
                  onClick={() => onTabChange('courses')}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-[10px] rounded hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchasedCourses.map((course) => (
                  <div key={course.id} className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400">{course.subject}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{course.name}</h4>
                      <p className="text-[10px] text-slate-400">{course.teacherName}</p>
                    </div>
                    <button 
                      onClick={() => onTabChange('videos')}
                      className="p-1 px-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 font-bold border border-slate-200 dark:border-slate-800 text-[10px] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Action Panel: Notification shelf logs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base flex items-center gap-1.5">
                <Bell size={15} />
                Alert Alerts Log
              </h3>
              {notifications.length > 0 && (
                <button 
                  onClick={clearNotifications}
                  className="text-[9px] text-red-500 uppercase font-mono font-bold hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No new push messages or dashboard adjustments.</p>
              ) : (
                notifications.map((notif, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-350 flex items-start gap-2 animate-in slide-in-from-right-4 duration-150">
                    <span className="p-0.5 bg-indigo-50 dark:bg-indigo-950 rounded text-indigo-500 font-bold text-[8px] uppercase mt-0.5">Alert</span>
                    <span className="leading-normal">{notif}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
