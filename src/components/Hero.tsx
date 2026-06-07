import React from 'react';
import { Play, Sparkles, GraduationCap, Video, Users } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onWatchDemo: () => void;
}

export default function Hero({ onStartLearning, onWatchDemo }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950 pt-20 pb-24 md:pt-28 md:pb-32 transition-colors">
      
      {/* Background visual geometric accent points */}
      <div className="absolute top-0 right-0 -mr-20 h-[500px] w-[500px] rounded-full bg-indigo-100/30 dark:bg-indigo-950/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 h-[500px] w-[500px] rounded-full bg-purple-100/30 dark:bg-purple-950/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Main heading core info column */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles size={13} className="animate-pulse" />
              <span>Adaptive AI Learning Ecosystem</span>
            </div>

            <h1 className="font-sans font-extrabold tracking-tight text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] transition-colors">
              Learn <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Anytime</span>, Anywhere
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Join Live Classes daily, watch thousands of tracked high-definition recordings, solve complex equations in seconds with Gemini doubts chatbot, and track personalized progress dashboards with peers.
            </p>

            {/* CTA interactions container */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartLearning}
                id="cta-start-learning"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all px-6 py-3.5 rounded-xl font-bold text-base text-white shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer text-center"
              >
                Start Learning Free
              </button>
              <button
                onClick={onWatchDemo}
                id="cta-watch-demo"
                className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-950 dark:text-slate-50 border border-slate-205 dark:border-slate-800 active:scale-98 transition-all px-6 py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={16} fill="currentColor" />
                Watch Demo Lesson
              </button>
            </div>

            {/* Social highlights badges under actions */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-900/60 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-xl sm:text-2xl">25,000+</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Enrolled Students</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-xl sm:text-2xl">100+</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">IITian & Board Tutors</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-xl sm:text-2xl">99.8%</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Success Rate</span>
              </div>
            </div>
          </div>

          {/* Interactive display graphic column with online-elements overlays */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg aspect-video lg:aspect-square bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-3xl overflow-hidden p-6 border border-slate-205/50 dark:border-slate-800/50 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" 
                alt="Students studying online" 
                className="w-full h-full object-cover rounded-2xl shadow-lg mix-blend-normal dark:opacity-85"
              />
              
              {/* Overlay glass tag 1: Live Classes indicator */}
              <div className="absolute top-10 left-10 p-3 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce shadow-indigo-500/5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">Live now</span>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Friction coefficients QA</span>
                </div>
              </div>

              {/* Overlay glass tag 2: Interactive metrics */}
              <div className="absolute bottom-10 right-10 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-purple-500/5">
                <div className="bg-indigo-100 dark:bg-indigo-950 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">My Assessment</span>
                  <span className="block text-xs font-bold text-emerald-605 dark:text-emerald-400">Level Boosted! (+450 XP)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
