import React, { useState } from 'react';
import { Plus, Trash, Users, Calendar, Video, LineChart, CheckCircle2, DollarSign } from 'lucide-react';
import { LiveClass, RecordedVideo, ClassLevel } from '../types';

interface TeacherDashboardProps {
  liveClasses: LiveClass[];
  setLiveClasses: (lc: LiveClass[] | ((prev: LiveClass[]) => LiveClass[])) => void;
  recordedVideos: RecordedVideo[];
  setRecordedVideos: (v: RecordedVideo[] | ((prev: RecordedVideo[]) => RecordedVideo[])) => void;
  onUserIncrementXp: (amount: number) => void;
  summary?: any;
}

export default function TeacherDashboard({
  liveClasses,
  setLiveClasses,
  recordedVideos,
  setRecordedVideos,
  onUserIncrementXp,
  summary,
}: TeacherDashboardProps) {
  const metricCards = summary?.stats || [
    { label: 'Earnings Analytics', value: '₹42,500', tone: 'emerald' },
    { label: 'Total Enrolled Students', value: '3,421', tone: 'indigo' },
    { label: 'Syllabus Classrooms', value: `${liveClasses.length} Scheduled`, tone: 'purple' },
    { label: 'Recorded Modules', value: `${recordedVideos.length} Modules`, tone: 'amber' },
  ];
  const displayedClasses = summary?.liveClasses || liveClasses;
  const displayedVideos = summary?.recordedVideos || recordedVideos;

  // Scheduling Form State
  const [liveTitle, setLiveTitle] = useState('');
  const [liveSubject, setLiveSubject] = useState('Physics');
  const [liveGrade, setLiveGrade] = useState<ClassLevel>('Class 10');
  const [liveDesc, setLiveDesc] = useState('');

  // Recording upload State
  const [recTitle, setRecTitle] = useState('');
  const [recSubject, setRecSubject] = useState('Physics');
  const [recGrade, setRecGrade] = useState<ClassLevel>('Class 10');
  const [recDesc, setRecDesc] = useState('');

  // Handle scheduling action
  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    const newClass: LiveClass = {
      id: `live-${Date.now()}`,
      title: liveTitle,
      teacherName: 'Self-Scheduled Tutor',
      timing: new Date().toISOString(),
      timingFormatted: 'Today (Just scheduled live)',
      status: 'upcoming',
      subject: liveSubject,
      classLevel: liveGrade,
      enrolledCount: 1,
      description: liveDesc || 'Syllabus concept exploration scheduled by educator portal.',
      meetingId: `room-${Date.now()}`
    };

    setLiveClasses(prev => [newClass, ...prev]);
    onUserIncrementXp(120);
    setLiveTitle('');
    setLiveDesc('');
    alert('Live lesson scheduled successfully! Students matching this level will receive push updates immediately.');
  };

  // Handle recording action
  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim()) return;

    const newVideo: RecordedVideo = {
      id: `rec-${Date.now()}`,
      title: recTitle,
      category: recSubject,
      teacherName: 'Self-Uploaded Tutor',
      watchProgress: 0,
      duration: '40 mins',
      views: 120,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500',
      description: recDesc || 'Syllabus concept lecture module.',
      classLevel: recGrade,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    };

    setRecordedVideos(prev => [newVideo, ...prev]);
    onUserIncrementXp(150);
    setRecTitle('');
    setRecDesc('');
    alert('Syllabus pack recording compiled successfully! Added directly to the recorded library filters.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Analytic grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metricCards.map((metric: any, index: number) => {
          const Icon = index === 0 ? DollarSign : index === 1 ? Users : index === 2 ? Calendar : Video;
          const color = index === 0 ? 'text-emerald-500' : index === 1 ? 'text-indigo-500' : index === 2 ? 'text-purple-500' : 'text-amber-500';

          return (
            <div key={metric.label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center">
              <Icon className={color + ' mx-auto'} size={24} />
              <span className="block font-sans font-black text-slate-900 dark:text-white text-2xl mt-1">{metric.value}</span>
              <span className="block text-[9px] text-slate-400 uppercase tracking-widest mt-1">{metric.label}</span>
            </div>
          );
        })}
      </div>

      {/* Forms Grid alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form A: Schedule Tutor Classes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Schedule New Live Classroom</h3>
              <p className="text-[11px] text-slate-400 text-slate-50 relative mt-1 block dark:text-slate-350">Updates instantly across student schedules.</p>
            </div>
          </div>

          <form onSubmit={handleScheduleClass} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Live Topic Title</label>
                <input 
                  type="text" 
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder="e.g. Electric flux integration Q&A"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject domain</label>
                <select
                  value={liveSubject}
                  onChange={(e) => setLiveSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                >
                  <option value="Physics">Physics mechanics</option>
                  <option value="Mathematics">Algebraic math</option>
                  <option value="Chemistry">Organic chemistry</option>
                  <option value="Biology">Genetic botany</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Class Group</label>
                <select
                  value={liveGrade}
                  onChange={(e) => setLiveGrade(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Live timings context</label>
                <span className="block text-slate-400 text-[10px] py-1">Assumed live instantly upon confirmation.</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Syllabus Overview desc</label>
              <textarea
                value={liveDesc}
                onChange={(e) => setLiveDesc(e.target.value)}
                placeholder="List topics or homework chapters covered..."
                className="w-full h-16 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              id="btn-teacher-schedule-confirm"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Schedule Board Classroom (+120 XP)
            </button>
          </form>
        </div>

        {/* Form B: Upload Lecture Recordings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <Video size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Compile Recording modules</h3>
              <p className="text-[11px] text-slate-400 text-slate-50 relative mt-1 block dark:text-slate-350">Directly populates recorded videos shelves.</p>
            </div>
          </div>

          <form onSubmit={handleUploadVideo} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Module Title</label>
                <input 
                  type="text" 
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g. Chemical formulas recap"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject domain</label>
                <select
                  value={recSubject}
                  onChange={(e) => setRecSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                >
                  <option value="Physics">Physics mechanics</option>
                  <option value="Mathematics">Algebraic math</option>
                  <option value="Chemistry">Organic chemistry</option>
                  <option value="Biology">Genetic botany</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Class Group</label>
                <select
                  value={recGrade}
                  onChange={(e) => setRecGrade(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Video parameters</label>
                <span className="block text-slate-400 text-[10px] py-1">Encoded in standard HLS streaming mp4 sandbox.</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Recording brief</label>
              <textarea
                value={recDesc}
                onChange={(e) => setRecDesc(e.target.value)}
                placeholder="Provide duration and details..."
                className="w-full h-16 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              id="btn-teacher-upload-confirm"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Upload Lecture Archive (+150 XP)
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
