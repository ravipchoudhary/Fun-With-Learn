import React from 'react';
import { Target, Lightbulb, TrendingUp, Users } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 pb-20">
      
      {/* 1. Page Header copy */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-indigo-600 dark:text-indigo-400 font-bold block">Company Pillars</span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Democratizing Interactive Education
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Our mission is to make standard interactive high-school and Board tutoring affordable, engaging, and personalized using top educators and adaptive AI helpers.
        </p>
      </div>

      {/* 2. Mission & Vision splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl space-y-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <Target size={24} />
          </div>
          <h2 className="font-sans font-extrabold text-slate-900 dark:text-white text-xl">Our Mission</h2>
          <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed">
            To empower millions of students to clear complex Board papers and entrance tests with zero math-phobia. We combine standard state pedagogy with WebRTC streams or real-time tutoring circles.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl space-y-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl w-fit">
            <Lightbulb size={24} />
          </div>
          <h2 className="font-sans font-extrabold text-slate-900 dark:text-white text-xl">Our Vision</h2>
          <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed">
            Creating a borderless educational universe where students can fetch homework answers, chat voice with senior mentors, and track customized dynamic paths in under a minute.
          </p>
        </div>
      </div>

      {/* 3. Learning Statistics */}
      <section className="bg-slate-900 p-8 sm:p-12 rounded-3xl text-white relative overflow-hidden shadow-xl text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="block font-sans font-black text-3xl sm:text-4xl text-indigo-400">10 Million+</span>
            <span className="block text-xs uppercase tracking-wider font-mono text-slate-400 mt-1">Minutes Studied</span>
          </div>
          <div>
            <span className="block font-sans font-black text-3xl sm:text-4xl text-purple-400">25,000+</span>
            <span className="block text-xs uppercase tracking-wider font-mono text-slate-400 mt-1">Registered Peers</span>
          </div>
          <div>
            <span className="block font-sans font-black text-3xl sm:text-4xl text-amber-500">100+</span>
            <span className="block text-xs uppercase tracking-wider font-mono text-slate-400 mt-1">Syllabus Classrooms</span>
          </div>
          <div>
            <span className="block font-sans font-black text-3xl sm:text-4xl text-emerald-400">98%</span>
            <span className="block text-xs uppercase tracking-wider font-mono text-slate-400 mt-1">Board score rating</span>
          </div>
        </div>
      </section>

      {/* 4. Instructor Profiles */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Our Senior Faculty</h2>
          <p className="text-slate-500 text-xs">Ph.D holders & IIT Alumni committed around the clock.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Ramesh Sharma",
              role: "Head of Mathematical Sciences (Senior CBSE Author)",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
              desc: "15+ years experience mentoring board exam toppers. Expert in calculus & quad formulas."
            },
            {
              name: "Prof. Neha Gupta",
              role: "Physics Department Head (IIT Kanpur Alumnus)",
              img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
              desc: "Specialist in fluid mechanics, friction, and kinematics. Passionate about Board experiments."
            },
            {
              name: "Dr. Vivek Mishra",
              role: "Senior Molecular Chemist (B.H.U Alumnus)",
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
              desc: "Unraveling atomic tables and organic reactions. Makes classroom experiments fun!"
            }
          ].map((prof, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
              <img src={prof.img} alt={prof.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{prof.name}</h3>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono block mt-1">{prof.role}</span>
              </div>
              <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-sans">{prof.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
