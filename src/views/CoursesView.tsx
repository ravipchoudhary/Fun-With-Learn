import React, { useState } from 'react';
import { Search, Filter, BookOpen, Award, CheckCircle } from 'lucide-react';
import { Course, ClassLevel } from '../types';
import { CLASS_LEVELS } from '../data';

interface CoursesViewProps {
  courses: Course[];
  purchasedCourseIds: string[];
  onSelectCourse: (course: Course) => void;
  onBuyCourse: (course: Course) => void;
}

export default function CoursesView({
  courses,
  purchasedCourseIds,
  onSelectCourse,
  onBuyCourse,
}: CoursesViewProps) {
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Derive unique subject categories in the catalog
  const uniqueSubjects = ['All', ...Array.from(new Set(courses.map(c => c.subject)))];

  // Filter courses based on class level, subject, and search query
  const filteredCourses = courses.filter((course) => {
    const matchesClass = selectedClassLevel === 'All' || course.classLevel === selectedClassLevel;
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title Board */}
      <div className="space-y-3">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Explore Certified Syllabus Packs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Learn from premier IITians and board exam consultants. Fully tracked with homework files, self-study modules, and weekly assessments.
        </p>
      </div>

      {/* Filter and Search Layout bar */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        
        {/* Search bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search math, physics, Dr. Ramesh..."
            value={searchQuery}
            id="course-search-field"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 placeholder-slate-400"
          />
        </div>

        {/* Subjects filters dropdown selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Filter size={13} />
            <span>Syllabus:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
          >
            {uniqueSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Level tag filters selectors list */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CLASS_LEVELS].map((lvl) => {
          const isActive = selectedClassLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedClassLevel(lvl)}
              id={`class-filter-${lvl.replace(' ', '')}`}
              className={`py-1.5 px-3.5 font-sans font-bold text-xs rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/10'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {/* Grid container with courses lists result cards */}
      {filteredCourses.length === 0 ? (
        <div className="min-h-[200px] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-2">
          <span>🔍</span>
          <h4 className="font-bold text-slate-800 dark:text-white text-sm">No courses match filters</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Try selecting a different grade filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const hasPurchased = purchasedCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between shadow-sm relative group"
                id={`card-${course.id}`}
              >
                <div>
                  {/* Thumbnail and absolute overlays */}
                  <div className="aspect-video relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <img 
                      src={course.thumbnail} 
                      alt={course.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {course.classLevel}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      ₹{course.price}
                    </span>
                  </div>

                  {/* Core copy */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wide text-indigo-500">
                      <span>{course.subject}</span>
                      <span>⏱️ {course.duration}</span>
                    </div>

                    <h3 
                      className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => onSelectCourse(course)}
                    >
                      {course.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer bar with buy action indicators */}
                <div className="p-5 pt-0">
                  <div className="border-t border-slate-50 dark:border-slate-800/60 pt-3 flex items-center justify-between text-xs mb-4">
                    <span className="text-slate-500 dark:text-slate-400">👋 {course.teacherName}</span>
                    <span className="text-amber-500 font-bold">⭐ {course.rating}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="flex-1 text-center py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      View Syllabus
                    </button>
                    {hasPurchased ? (
                      <span className="flex-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 py-2 rounded-lg text-xs font-extrabold text-center flex items-center justify-center gap-1">
                        <CheckCircle size={12} />
                        Bought
                      </span>
                    ) : (
                      <button
                        onClick={() => onBuyCourse(course)}
                        id={`btn-buy-${course.id}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
