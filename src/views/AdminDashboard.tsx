import React, { useState } from 'react';
import { ShieldAlert, LineChart, Users, CheckSquare, BarChart, Settings, Trash, AlertTriangle, Play } from 'lucide-react';
import { UserProfile, Course, LiveClass } from '../types';

interface AdminDashboardProps {
  initialCourses: Course[];
  initialLiveClasses: LiveClass[];
  userName: string;
  summary?: any;
}

export default function AdminDashboard({
  initialCourses,
  initialLiveClasses,
  userName,
  summary,
}: AdminDashboardProps) {
  const summaryStats = summary?.stats || [
    { label: 'Global Revenue', value: '₹1,42,500', tone: 'indigo' },
    { label: 'Accounts Count', value: '5 logged', tone: 'purple' },
    { label: 'Syllabus coverage', value: String(initialCourses.length), tone: 'emerald' },
    { label: 'Model provider', value: 'Gemini 3.5 Flash', tone: 'amber' },
  ];

  // Activity state logs simulated list
  const [logs, setLogs] = useState<string[]>([
    'System initialization successful - Express + Vite server ready',
    'User student profile set to "Premium" state via sandboxed Razorpay verification',
    'Live classroom friction coefficients established successfully - WebRTC active',
    'AI Course recommendations generated for student - Gemini-3.5-flash',
  ]);

  const [usersList, setUsersList] = useState<any[]>(summary?.users || [
    { name: 'Suhani Malhotra', email: 'suhani@boardscore.com', role: 'Student', plan: 'Premium' },
    { name: 'Dr. Ramesh Sharma', email: 'ramesh@funwithlearn.edu', role: 'Teacher', plan: 'None' },
    { name: 'Pranav Joshi', email: 'pranav_joshi@gmail.com', role: 'Student', plan: 'Standard' },
    { name: 'Neha Gupta', email: 'neha_physics@funwithlearn.edu', role: 'Teacher', plan: 'None' },
  ]);

  const handleDeleteUser = (idx: number, name: string) => {
    setUsersList(prev => prev.filter((_, i) => i !== idx));
    setLogs(prev => [`Deleted user "${name}" from system metadata repository`, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryStats.map((stat: any, index: number) => {
          const Icon = index === 0 ? LineChart : index === 1 ? Users : index === 2 ? CheckSquare : Settings;
          const color = index === 0 ? 'text-indigo-500' : index === 1 ? 'text-purple-500' : index === 2 ? 'text-emerald-500' : 'text-amber-500';
          return (
            <div key={stat.label} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl text-white">
              <Icon className={color + ' mb-2'} size={20} />
              <span className="block text-[10px] font-mono tracking-widest text-slate-450 uppercase">{stat.label}</span>
              <span className="block font-sans font-black text-2xl mt-1">{stat.value}</span>
              <span className="block text-[9px] text-emerald-400 mt-1">{index === 0 ? '📈 +18% this week' : index === 1 ? 'Student, Teacher & Admin' : index === 2 ? 'Class 6 to Board levels 12' : 'Server-side execution'}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core database user accounts moderation */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-5">
          <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">User Management Panel ({usersList.length})</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-350 select-none">
              <thead className="bg-slate-55 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3 text-right">Moderate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {usersList.map((usr, uIdx) => (
                  <tr key={usr.email}>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{usr.name}</td>
                    <td className="py-3 px-3 font-mono">{usr.email}</td>
                    <td className="py-3 px-3 font-medium">{usr.role}</td>
                    <td className="py-3 px-3">
                      <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold text-[9px]">{usr.plan}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => handleDeleteUser(uIdx, usr.name)}
                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time system log tracker */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 space-y-4 text-white">
          <h3 className="font-sans font-bold text-sm tracking-wide uppercase text-slate-400 flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <ShieldAlert size={14} className="text-amber-500" />
            System Operations Log
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto text-[10px] font-mono leading-relaxed">
            {logs.map((log, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-505 text-[8px]">
                  <span>EVENT LOG #{idx + 1}</span>
                  <span>JUST NOW</span>
                </div>
                <p className="p-2 bg-slate-900/60 rounded border border-slate-900 text-slate-200">
                  {log}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
