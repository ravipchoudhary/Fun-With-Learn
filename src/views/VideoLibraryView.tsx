import React, { useState } from 'react';
import { Search, MonitorPlay, Eye, Clock, Check, Play, BookOpen, SkipForward } from 'lucide-react';
import { RecordedVideo, ClassLevel } from '../types';
import { CLASS_LEVELS } from '../data';

interface VideoLibraryViewProps {
  videos: RecordedVideo[];
  setVideos: (v: RecordedVideo[] | ((prev: RecordedVideo[]) => RecordedVideo[])) => void;
  onUserIncrementXp: (amount: number) => void;
  activeVideo: RecordedVideo | null;
  setActiveVideo: (v: RecordedVideo | null) => void;
}

export default function VideoLibraryView({
  videos,
  setVideos,
  onUserIncrementXp,
  activeVideo,
  setActiveVideo,
}: VideoLibraryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [videoPlaybackActive, setVideoPlaybackActive] = useState(false);

  // Derive unique categories/subjects from recordings
  const uniqueCategories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];

  // Filters recorded libraries
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesClassLevel = selectedClassLevel === 'All' || video.classLevel === selectedClassLevel;
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClassLevel && matchesSearch;
  });

  // Calculate shelf of lectures already in progress
  const inProgressVideos = videos.filter(v => v.watchProgress > 0 && v.watchProgress < 100);

  // Handles simulated quick playback progress update
  const triggerTickProgress = () => {
    if (!activeVideo) return;
    
    setVideos(prev => 
      prev.map(v => {
        if (v.id === activeVideo.id) {
          const updatedProgress = Math.min(v.watchProgress + 15, 100);
          // Reward XP on progress increments
          if (updatedProgress === 100 && v.watchProgress < 100) {
            onUserIncrementXp(100);
          } else {
            onUserIncrementXp(15);
          }
          const updatedVideo = { ...v, watchProgress: updatedProgress };
          // Keep active video object synchronized
          setActiveVideo(updatedVideo);
          return updatedVideo;
        }
        return v;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Search and Playback Layout splits */}
      <div className="space-y-4">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Tracked High-Definition Lecture Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Watch recorded modules. If you close your browser, the platform saves your exact bookmark time so you can resume fluidly.
        </p>
      </div>

      {/* Dynamic Active playback viewport if selected */}
      {activeVideo && (
        <div 
          className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 shadow-2xl space-y-4 p-4 md:p-6 text-white transform animate-in fade-in duration-200"
          id="lecture-video-player"
        >
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-wider bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase">
                Active Player
              </span>
              <h2 className="font-bold text-base sm:text-lg mt-2">{activeVideo.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Instructor: {activeVideo.teacherName} • Subject: {activeVideo.category}</p>
            </div>
            <button
              onClick={() => {
                setActiveVideo(null);
                setVideoPlaybackActive(false);
              }}
              className="px-3.5 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-705 transition-colors cursor-pointer"
            >
              Close Lecture Player
            </button>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-900 flex flex-col items-center justify-center text-center p-6 bg-slate-950">
            {videoPlaybackActive ? (
              <div className="w-full h-full flex flex-col justify-between items-center py-8">
                {/* Simulated playback visual frames */}
                <span className="animate-pulse h-2 bg-indigo-500 w-20 rounded-full" />
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full border-2 border-white flex items-center justify-center text-xs animate-spin border-t-transparent" />
                  <p className="text-xs font-mono text-slate-400">Streaming video lecture chunk: /ts_packets_{activeVideo.id}.m3u8</p>
                </div>

                {/* Progress controls bar mock */}
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-xs text-slate-450 font-mono">
                    <span>Active watch position</span>
                    <span>{activeVideo.watchProgress}% completed</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300" 
                      style={{ width: `${activeVideo.watchProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setVideoPlaybackActive(true)}
                  className="mx-auto h-16 w-16 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <Play size={26} fill="white" className="text-white ml-1" />
                </button>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Start Board Recap</h4>
                  <p className="text-[11px] text-slate-500">Bookmark position detected at: {activeVideo.watchProgress}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive controls bar to update progress log */}
          {videoPlaybackActive && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <span className="text-slate-400">Test learning tracking: Increment the stream progress log metrics!</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={triggerTickProgress}
                  id="btn-fast-forward-progress"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SkipForward size={14} />
                  Fast-Forward +15%
                </button>
                {activeVideo.watchProgress === 100 && (
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg font-bold flex items-center gap-1">
                    <Check size={14} /> Fully Watched (+100 XP)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* "Resume Watching" shelf for students items */}
      {inProgressVideos.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <MonitorPlay size={16} className="text-purple-500" />
            Resume Watching
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inProgressVideos.map(video => (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  setVideoPlaybackActive(true);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl hover:border-purple-200 cursor-pointer flex gap-3 shadow-sm"
              >
                <img src={video.thumbnail} alt={video.title} className="w-16 h-12 rounded object-cover" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-[11px] line-clamp-1">{video.title}</h4>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: `${video.watchProgress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">{video.watchProgress}% watched</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main categories tag filters bar */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        
        {/* Search bar inside records */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search within video lectures syllabus..."
            value={searchQuery}
            id="video-search-field"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...CLASS_LEVELS].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedClassLevel(lvl)}
            className={`py-1 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              selectedClassLevel === lvl
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Records output stream matrix */}
      {filteredVideos.length === 0 ? (
        <div className="min-h-[160px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <span>🎥</span>
          <h4 className="font-bold text-sm block mt-2 text-slate-900 dark:text-white">No recording results match filter</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between shadow-sm relative group"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                    {video.classLevel}
                  </span>
                  
                  {/* Status checklist completed flag overlay */}
                  {video.watchProgress === 100 && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none shadow-md shadow-emerald-950/25">
                      <Check size={10} strokeWidth={3} /> Completed
                    </span>
                  )}
                  
                  {/* Visual tracker outline progress underline */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                    <div className="bg-purple-600 h-full transition-all" style={{ width: `${video.watchProgress}%` }} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>{video.category}</span>
                    <span>👁️ {video.views.toLocaleString()} reviews</span>
                  </div>

                  <h3 
                    className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1 cursor-pointer hover:text-purple-600 transition-colors"
                    onClick={() => setActiveVideo(video)}
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="border-t border-slate-50 dark:border-slate-800/60 pt-3 flex items-center justify-between text-xs mb-3">
                  <span>👩‍🏫 {video.teacherName}</span>
                  <span className="font-mono text-[10px]">⏱️ {video.duration}</span>
                </div>

                <button
                  onClick={() => {
                    setActiveVideo(video);
                    setVideoPlaybackActive(true);
                  }}
                  id={`btn-watch-rec-${video.id}`}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-705"
                >
                  <Play size={12} fill="white" />
                  {video.watchProgress > 0 ? `Resume recap (${video.watchProgress}%)` : 'Watch recorded lecture'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
