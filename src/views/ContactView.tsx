import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldAlert } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setDispatched(true);
    // Mimic database insert of comments
    setTimeout(() => {
      setName('');
      setEmail('');
      setMobile('');
      setSubject('');
      setMessage('');
      setDispatched(false);
      alert('Your educational inquiry registration has been recorded successfully! Our Board coordination team will alert you shortly.');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          We operate around the clock to support Board students, parents, and school faculties. Fill of corresponding inquiry points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Contact fields form block */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Deshmukh"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 px-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email ID</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@boardscore.com"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 px-3 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 px-3 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject domain</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. CBSE Class 10 Premium boards guidance"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 px-3 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Your inquiry details</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention class levels, weak subjects, or subscription issues..."
                className="w-full h-24 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 px-3 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={dispatched}
              id="btn-contact-submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {dispatched ? 'Submitting inquiry...' : 'Submit Inquiry'}
              <Send size={12} />
            </button>
          </form>
        </div>

        {/* Support contacts and map layout */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-6">
            <h3 className="font-bold text-base block">Contact coordinates</h3>
            
            <div className="space-y-4 text-xs text-slate-350">
              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-500" size={16} />
                <span>Greater Noida, Uttar Pradesh, 201318</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-purple-500" size={16} />
                <span>9903833795</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-emerald-500" size={16} />
                <span>support@funwithlearn.edu</span>
              </div>
            </div>
          </div>

          {/* Interactive Vector Google Map placeholder */}
          <div className="h-60 bg-slate-100 dark:bg-slate-800/60 rounded-2xl relative border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between p-4">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Headquarters location grid</span>
            
            {/* Visual geographic elements */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-4 w-4 bg-red-500 rounded-full animate-ping flex items-center justify-center">
                <MapPin size={10} color="white" />
              </div>
              <span className="font-mono text-[10px] text-slate-550 dark:text-slate-300 font-bold">Latitude: 12.9716° N • Longitude: 77.5946° E</span>
              <p className="text-[9px] text-slate-400">Bengaluru Space Center</p>
            </div>
            
            <span className="text-[9px] text-slate-400 text-right">Fully compatible with standard Google Location API rules</span>
          </div>
        </div>

      </div>
    </div>
  );
}
