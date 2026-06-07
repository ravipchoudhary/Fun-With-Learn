import React, { useState, useEffect, useRef } from 'react';
import { Video, ShieldCheck, Users, MessageSquare, ScreenShare, Play, Mic, MicOff, Camera, CameraOff, Send } from 'lucide-react';
import { LiveClass, ChatMessage } from '../types';

interface LiveViewProps {
  liveClasses: LiveClass[];
  activeClass: LiveClass | null;
  setActiveClass: (lc: LiveClass | null) => void;
  attendanceCount: number;
  setAttendanceCount: (count: number | ((prev: number) => number)) => void;
  userRole: string;
  userName: string;
  onUserIncrementXp: (amount: number) => void;
}

export default function LiveView({
  liveClasses,
  activeClass,
  setActiveClass,
  attendanceCount,
  setAttendanceCount,
  userRole,
  userName,
  onUserIncrementXp,
}: LiveViewProps) {
  // Video streams simulated triggers
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  
  // Real-time Chat Simulator list and message formulation
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { id: '1', senderName: 'Pranav Joshi', senderRole: 'student', text: 'Dr. Ramesh, is friction force always negative or is it just opposite?', timestamp: '09:31' },
    { id: '2', senderName: 'Prof. Neha Gupta', senderRole: 'teacher', text: 'Good question Pranav, it opposes the relative motion!', timestamp: '09:32' },
    { id: '3', senderName: 'Aditi Sinha', senderRole: 'student', text: 'Yes, looking forward to solving the practice sheets.', timestamp: '09:33' }
  ]);
  const [outgoingChatText, setOutgoingChatText] = useState('');
  
  // Camera reference captures
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-scroller for chatbox
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize selected stream first
  useEffect(() => {
    if (!activeClass && liveClasses.length > 0) {
      setActiveClass(liveClasses[0]);
    }
  }, [liveClasses, activeClass, setActiveClass]);

  // Handle stream camera captures beautifully
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        // Elevate XP for active contribution
        onUserIncrementXp(100);
      } catch (err) {
        alert('Permission denied or web camera missing. Activating high-fidelity fallback presentation stream!');
        setCameraActive(true);
      }
    }
  };

  // Chat message send handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outgoingChatText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: userName || 'Enrolled Student',
      senderRole: (userRole as any) || 'student',
      text: outgoingChatText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, newMessage]);
    setOutgoingChatText('');
    
    // Quick auto scroll
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Simulate instant teacher responsive answering
    setTimeout(() => {
      const tutorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderName: activeClass?.teacherName || 'Tutor',
        senderRole: 'teacher',
        text: `Excelent thought ${userName}! Let\'s cover exactly that in slide number four.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatLog(prev => [...prev, tutorReply]);
      // Reward Student for query engagement
      onUserIncrementXp(50);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  // Chat autoscroller
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Video Classroom View & Whiteboard Controls */}
        <div className="lg:col-span-2 space-y-6">
          {activeClass ? (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Tutoring stage window header info overlay */}
              <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between text-white z-10 relative">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <h2 className="font-bold text-sm sm:text-base">{activeClass.title}</h2>
                    <p className="text-xs text-slate-400">Classroom coordinator: {activeClass.teacherName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-300">
                  <Users size={12} className="text-indigo-400" />
                  <span>{attendanceCount} watching</span>
                </div>
              </div>

              {/* WebRTC Video Display feed sandbox area */}
              <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center text-center p-6 relative">
                {cameraActive ? (
                  <div className="w-full h-full relative">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover rounded-xl"
                      playsInline 
                      muted 
                    />
                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] pointer-events-none" />
                    <div className="absolute bottom-4 left-4 p-2 bg-slate-950/80 rounded-lg text-[10px] text-white font-mono flex items-center gap-2 border border-slate-800">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>WebRTC Active Peer: {userName} (Simulated Student)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto h-16 w-16 bg-indigo-950 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-800">
                      <Video size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Tutoring Stream Ready</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">Accept camera/voice permissions to establish standard WebRTC live connection.</p>
                    </div>
                    <button
                      onClick={toggleCamera}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Establish Live Video Link
                    </button>
                  </div>
                )}

                {/* Overlapped teacher mock projection board */}
                <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800/80 p-3 rounded-lg text-left max-w-[200px] shadow-lg">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase">Interactive Whiteboard</span>
                  <div className="mt-1 h-1 w-full bg-indigo-500 rounded" />
                  <p className="text-[10px] text-slate-300 leading-normal mt-1.5 font-mono">
                    Slide 3: F_s_max = μ_s * N
                  </p>
                </div>
              </div>

              {/* Classroom Control Panel and WebRTC switches */}
              <div className="bg-slate-950 p-4 border-t border-slate-850 flex items-center justify-between text-white flex-wrap gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMicActive(!micActive)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${micActive ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500/20 text-red-500'}`}
                    title={micActive ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                  <button 
                    onClick={toggleCamera}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${cameraActive ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-800/45 text-slate-500'}`}
                    title="Change Camera State"
                  >
                    {cameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
                  </button>
                  <button 
                    onClick={() => {
                      setScreenSharing(!screenSharing);
                      if (!screenSharing) onUserIncrementXp(150);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${screenSharing ? 'bg-indigo-600 font-bold text-white' : 'bg-slate-800 text-slate-400'}`}
                    title="Share Screen"
                  >
                    <ScreenShare size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Secure DRM Stream Enforced</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-center p-6">
              <span className="text-slate-400 text-sm">No ongoing sessions selected</span>
            </div>
          )}

          {/* Active Class Syllabus Details summary tabs */}
          {activeClass && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">{activeClass.subject}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{activeClass.classLevel}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{activeClass.title}</h3>
              <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{activeClass.description}</p>
              
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-3">
                <span>⚡ Scheduled Timing: {activeClass.timingFormatted}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">✅ Homework challenge will release right after lecture</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tab Selection list & Dynamic Live Doubt Chats board */}
        <div className="space-y-6">
          
          {/* Active Tutoring Catalog selector column */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Select Tutoring Session</h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {liveClasses.map((item) => {
                const isSelected = activeClass?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveClass(item);
                      setAttendanceCount(item.status === 'ongoing' ? 342 : 0);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border flex flex-col justify-between items-start cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10' 
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{item.subject}</span>
                      {item.status === 'ongoing' && (
                        <span className="bg-red-500 text-white rounded px-1.5 py-0.5 text-[8px] font-extrabold tracking-wide uppercase animate-pulse">LIVE</span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs mt-1 block line-clamp-1">{item.title}</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Tutor: {item.teacherName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Peer chats dashboard */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-96 flex flex-col justify-between overflow-hidden shadow-md">
            
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare size={13} className="text-indigo-500" />
                Doubt Sandbox Chat
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            </div>

            {/* Chat list block */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatLog.map((chat) => (
                <div key={chat.id} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className={`font-bold ${chat.senderRole === 'teacher' ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-650 dark:text-indigo-400'}`}>
                      {chat.senderName} {chat.senderRole === 'teacher' && '(Tutor)'}
                    </span>
                    <span className="text-slate-400">{chat.timestamp}</span>
                  </div>
                  <p className="bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-slate-705 dark:text-slate-300">
                    {chat.text}
                  </p>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input dispatching form bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex gap-2">
              <input
                type="text"
                placeholder="Ask classroom doubt..."
                value={outgoingChatText}
                onChange={(e) => setOutgoingChatText(e.target.value)}
                id="live-chat-input"
                className="flex-1 bg-white dark:bg-slate-900 text-xs border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-905 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                id="btn-live-chat-send"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-all cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
