import React from 'react';
import { Sparkles, Calendar, BookOpen, Users, Video, Award, Phone, Mail, MapPin } from 'lucide-react';
import { LiveClass, Course } from '../types';
import { MOCK_REVIEWS, GENERAL_FAQS } from '../data';

interface HomeViewProps {
  upcomingClasses: LiveClass[];
  popularCourses: Course[];
  onTabChange: (tabId: string) => void;
  onJoinLive: (liveClass: LiveClass) => void;
  onSelectCourse: (course: Course) => void;
  userRole: string;
}

export default function HomeView({
  upcomingClasses,
  popularCourses,
  onTabChange,
  onJoinLive,
  onSelectCourse,
  userRole,
}: HomeViewProps) {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">Comprehensive Capabilities</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Designed for Peak Classroom Engagement
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Everything a high-schooler needs to leap from average scores to exceptional subject ranks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: <Calendar className="text-indigo-600 dark:text-indigo-400" size={24} />,
              title: "Daily Live Classrooms",
              desc: "100% active WebRTC streaming with whiteboard annotations and peer chatboards."
            },
            {
              icon: <Video className="text-purple-600 dark:text-purple-400" size={24} />,
              title: "Tracked Lectures Library",
              desc: "Resume watching complex lectures across devices. Saves watch-stages instantly."
            },
            {
              icon: <Sparkles className="text-amber-500" size={24} />,
              title: "Adaptive Gemini AI",
              desc: "Solve high-yield equation problems, formulate study day logs, and get course recs."
            },
            {
              icon: <Award className="text-emerald-500" size={24} />,
              title: "Gamified Mile-stones",
              desc: "Gain study XP, level ratings, global credentials, and downloadable performance reports."
            }
          ].map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">{feat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Live Tutoring Preview Shelf */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-red-500 font-bold block mb-1">Interactive Board Feed</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Upcoming & In-Progress Tutoring
              </h2>
            </div>
            <button 
              onClick={() => onTabChange('live')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              View Full Live Calendar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all"
              >
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      {item.subject}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.classLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                  
                  <div className="border-t border-slate-50 dark:border-slate-800/60 pt-3 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-350">
                    <span>👩‍🏫 {item.teacherName}</span>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wide text-indigo-500">⏰ {item.timingFormatted}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">⚡ {item.enrolledCount} Registered</span>
                  <button 
                    onClick={() => onJoinLive(item)}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    {item.status === 'ongoing' ? '🔴 Join Classroom' : 'Notify Me'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Hero Courses Preview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 font-bold block mb-1">Most Enrolled Syllabus</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Syllabus Coverage Packs
            </h2>
          </div>
          <button 
            onClick={() => onTabChange('courses')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Browse All Subjects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.slice(0, 3).map((course) => (
            <div 
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col"
              onClick={() => onSelectCourse(course)}
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={course.thumbnail} 
                  alt={course.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {course.classLevel}
                </span>
                <span className="absolute bottom-3 right-3 bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  ₹{course.price}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{course.subject}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1 text-base">{course.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{course.description}</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-350">📝 {course.teacherName}</span>
                  <span className="text-amber-500 font-bold">⭐ {course.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Student & Parent Testimonials */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">Success Stories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Trusted by 25k+ Happy Students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_REVIEWS.map((rev, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 relative"
              >
                <div className="flex items-center gap-3">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.name}</h4>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">{rev.role}</span>
                  </div>
                </div>
                <div className="text-yellow-500 font-bold text-sm">★★★★★</div>
                <p className="text-slate-600 dark:text-slate-300 text-xs italic tracking-wide leading-relaxed">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Download Android App Callout Wrapper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-white/10 rounded-full blur-2xl transform translate-x-20 -translate-y-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="bg-white/20 text-white rounded-full text-xs font-bold px-3 py-1 uppercase tracking-wider font-mono">
                Learning on Android
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold leading-tight">
                Get the Fun With Learn Native Android APK
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed max-w-md">
                Attend lectures offline, download homework files directly, chat voice on standard simulated tablets, and receive push alerts for next morning sessions.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => alert('Download requested! Initiating mock APK file bundle transfer.')}
                  className="bg-white text-slate-900 font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors pointer-events-auto"
                >
                  🚀 Download Google Play Store Mock APK
                </button>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-end">
              <div className="relative bg-slate-950 p-3 rounded-3xl border-4 border-slate-850 shadow-2xl w-56 aspect-[9/18] overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 mb-1 border-b border-slate-900 pb-1">
                  <span>FUN WITH LEARN</span>
                  <span>100% LIVE</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="block text-[10px] font-bold text-white uppercase">Active Board Session</span>
                  <p className="text-[8px] text-slate-400">Dr. Sharma Board Revision is currently taking answers</p>
                </div>
                <div className="h-1.5 w-16 bg-slate-800 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block">Need Answers?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {GENERAL_FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 shadow-sm"
              id={`faq-${idx}`}
            >
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-start gap-1">
                <span>🤔</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
