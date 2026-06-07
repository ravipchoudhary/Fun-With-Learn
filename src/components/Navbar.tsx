import React, { useState } from 'react';
import { Sun, Moon, Bell, Menu, X, ShieldCheck, User, LogIn } from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import Logo from './Logo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  notificationsCount: number;
  setNotificationsOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  onOpenRoleModal: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  theme,
  setTheme,
  profile,
  setProfile,
  notificationsCount,
  setNotificationsOpen,
  notificationsOpen,
  onOpenRoleModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'live', label: 'Live Classes' },
    { id: 'videos', label: 'Recordings' },
    { id: 'subscription', label: 'Study Plans' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => handleTabClick('home')}>
          <Logo size={40} />
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-905'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls Frame */}
        <div className="flex items-center gap-2">
          {/* AI Helper Button */}
          <button
            onClick={() => handleTabClick('ai-assistant')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 transition-all cursor-pointer ${
              currentTab === 'ai-assistant' ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-950' : ''
            }`}
          >
            <span className="animate-pulse">✨</span> AI Doubts Solver
          </button>

          {/* Quick Active Portal Access based on Role */}
          <button
            onClick={() => {
              if (profile.role === 'student') handleTabClick('student-dashboard');
              else if (profile.role === 'teacher') handleTabClick('teacher-dashboard');
              else handleTabClick('admin-dashboard');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              currentTab.includes('dashboard') || currentTab.includes('portal')
                ? 'bg-indigo-650 hover:bg-indigo-710 bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <User size={13} />
            <span className="capitalize">{profile.role} Portal</span>
          </button>

          {/* Role Change Quick Trigger */}
          <button
            onClick={onOpenRoleModal}
            title="Change User Persona Role / Subscription Status"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <LogIn size={18} />
          </button>

          {/* Theme Toggle Controller */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Responsive Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {mainTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold block transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-905'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleTabClick('ai-assistant')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center gap-1.5"
            >
              <span>✨</span> Solve Doubts with Gemini
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
