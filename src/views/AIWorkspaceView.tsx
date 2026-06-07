import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, MessageSquare, AlertTriangle, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIWorkspaceViewProps {
  userName: string;
}

export default function AIWorkspaceView({ userName }: AIWorkspaceViewProps) {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      senderName: 'Gemini Assistant',
      senderRole: 'teacher',
      text: `Hello ${userName}! I am your custom Gemini Doubt Solver on Fun With Learn. Ask me any conceptual query (e.g., "What is the difference between mitosis and meiosis?" or "Give me the formula of quadratic acceleration") and I will outline it for you instantly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const studentMessage = inputText;
    const studentLog: ChatMessage = {
      id: Date.now().toString(),
      senderName: userName || 'Enrolled Student',
      senderRole: 'student',
      text: studentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, studentLog]);
    setInputText('');
    setIsGenerating(true);

    // Dynamic fetch from server-side Express Gemini proxy
    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: studentMessage,
          history: chatLog,
        }),
      });
      const data = await response.json();
      
      const assistantLog: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderName: 'Gemini Assistant',
        senderRole: 'teacher',
        text: data.text || 'I understand your query, but could not produce an output. Please rephrase.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatLog(prev => [...prev, assistantLog]);
    } catch (err) {
      console.error(err);
      const errLog: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderName: 'Gemini Assistant',
        senderRole: 'teacher',
        text: 'Error contacting Gemini Server. Make sure your network is stable and your API credentials are configured in Settings secrets.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatLog(prev => [...prev, errLog]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Autoscroll chat history
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between min-h-[500px]">
        
        {/* Chat Header banner */}
        <div className="bg-slate-950 p-5 text-white flex items-center justify-between border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2.5 rounded-xl text-white animate-pulse">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Gemini Board Doubt Solver</h3>
              <p className="text-[10px] text-slate-400">Powered by server-side gemini-3.5-flash with secure API guidelines</p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        {/* Message logs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px]">
          {chatLog.map((chat) => {
            const isAssitant = chat.senderName === 'Gemini Assistant';
            return (
              <div 
                key={chat.id} 
                className={`flex flex-col max-w-[85%] space-y-1 ${isAssitant ? 'self-start' : 'self-end ml-auto'}`}
              >
                <div className={`text-[9px] font-mono font-bold tracking-wide ${isAssitant ? 'text-purple-500' : 'text-indigo-500 text-right'}`}>
                  {chat.senderName} • {chat.timestamp}
                </div>
                <div 
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    isAssitant 
                      ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-350' 
                      : 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{chat.text}</p>
                </div>
              </div>
            );
          })}
          
          {isGenerating && (
            <div className="flex flex-col text-slate-400 text-xs gap-1.5 animate-pulse">
              <span className="text-[9px] font-mono leading-none">GEMINI THINKING ACTIVE...</span>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl max-w-xs flex items-center gap-2 dark:bg-slate-950/20 dark:border-slate-850">
                <RefreshCw size={12} className="animate-spin text-purple-500" />
                <span>Formulating responsive curriculum answering...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Dispatch messages inputs bar */}
        <form 
          onSubmit={handleSendMessage} 
          className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask doubt: e.g. 'explain kinetic law step by step'..."
            value={inputText}
            id="workspace-chatbot-field"
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-3 px-4 text-xs font-semibold rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-55"
          />
          <button
            type="submit"
            disabled={isGenerating || !inputText.trim()}
            id="btn-workspace-chatbot-send"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </form>

      </div>
    </div>
  );
}
