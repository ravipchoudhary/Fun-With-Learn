/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import CoursesView from './views/CoursesView';
import LiveView from './views/LiveView';
import VideoLibraryView from './views/VideoLibraryView';
import PlanView from './views/PlanView';
import StudentDashboard from './views/StudentDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import ContactView from './views/ContactView';
import AIWorkspaceView from './views/AIWorkspaceView';
import RazorpayModal from './components/RazorpayModal';

import { 
  INITIAL_COURSES, 
  INITIAL_LIVE_CLASSES, 
  INITIAL_RECORDED_VIDEOS, 
  SUBSCRIPTION_PLANS 
} from './data';
import { UserProfile, Course, LiveClass, RecordedVideo, SubscriptionPlan } from './types';

export default function App() {
  // Global View Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Primary data states
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(INITIAL_LIVE_CLASSES);
  const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>(INITIAL_RECORDED_VIDEOS);

  // Active viewing/playing entities
  const [activeVideo, setActiveVideo] = useState<RecordedVideo | null>(null);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [attendanceCount, setAttendanceCount] = useState<number>(342);

  // User Profile Credentials
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Suhani Malhotra',
    email: '2018mravi@gmail.com',
    mobile: '9876543210',
    role: 'student', // 'student' | 'teacher' | 'admin'
    subscriptionPlan: 'Premium', // 'Basic' | 'Standard' | 'Premium' | 'None'
    progress: 45,
    completedHours: 12,
    totalXP: 450
  });

  // Client simulated histories & purchases
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(['course-1', 'course-2']);
  const [notifications, setNotifications] = useState<string[]>([
    'Dr. Ramesh Sharma added Advanced Mathematics resources for Boards preparation.',
    'Your live physics review session is starting tomorrow morning at 09:30 AM.'
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sandboxed Razorpay Transaction overlay State
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);

  // Role Selection Switcher Modal Trigger state
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Synchronize CSS class for system dark colors setting
  useEffect(() => {
    const rootElement = document.documentElement;
    if (theme === 'dark') {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle billing payment updates
  const handlePaymentSuccess = (planTier: 'Basic' | 'Standard' | 'Premium') => {
    setProfile(prev => ({
      ...prev,
      subscriptionPlan: planTier
    }));
    setNotifications(prev => [
      `Subscription Plan updated successfully to ${planTier}! Welcome to Fun With Learn Premium features.`,
      ...prev
    ]);
    alert(`Success! Sandboxed checkout complete. Account tier upgraded to ${planTier}.`);
  };

  const handleBuyCourse = (course: Course) => {
    setPurchasedCourseIds(prev => [...prev, course.id]);
    setNotifications(prev => [
      `Enrolled successfully in certified syllabus pack: "${course.name}"!`,
      ...prev
    ]);
    setProfile(prev => ({ ...prev, totalXP: prev.totalXP + 100 }));
    alert(`Successful mock purchase! "${course.name}" is now unlocked in your Student Portal.`);
  };

  const handleIncrementXp = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      totalXP: prev.totalXP + amount,
      completedHours: prev.completedHours + (amount > 100 ? 1 : 0.5)
    }));
  };

  // Switch to responsive course selectors
  const handleStartLearning = () => {
    setCurrentTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggles playable video modal/overlay from hero CTA
  const handleWatchDemoVideo = () => {
    if (recordedVideos.length > 0) {
      setActiveVideo(recordedVideos[0]);
      setCurrentTab('videos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 transition-colors duration-200">
      
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
        profile={profile}
        setProfile={setProfile as any}
        notificationsCount={notifications.length}
        setNotificationsOpen={setNotificationsOpen}
        notificationsOpen={notificationsOpen}
        onOpenRoleModal={() => setRoleModalOpen(true)}
      />

      {/* Optional Notification drop-shadow drawer panel */}
      {notificationsOpen && (
        <div className="absolute right-6 top-16 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-4 rounded-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Push Messages Inbox</span>
            <button 
              onClick={() => setNotifications([])}
              className="text-[10px] text-red-500 font-mono font-bold hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3.5 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No push notifications.</p>
            ) : (
              notifications.map((msg, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <p className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans">{msg}</p>
                  <span className="text-[9px] font-mono text-slate-400">System • alert update</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Role Picker Sandbox Modal Overlay */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl max-w-sm w-full space-y-6">
            <div>
              <h3 className="font-sans font-extrabold text-slate-950 dark:text-slate-50 text-base">User Sandbox Switcher</h3>
              <p className="text-xs text-slate-400 mt-1">Interchange student, teacher, or admin roles and test of matching dashboards.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Change Active Portal Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['student', 'teacher', 'admin'].map((rl) => (
                    <button
                      key={rl}
                      onClick={() => setProfile(prev => ({ ...prev, role: rl as any, name: rl === 'student' ? 'Suhani Malhotra' : rl === 'teacher' ? 'Dr. Ramesh Sharma' : 'Platform Owner' }))}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize cursor-pointer border ${
                        profile.role === rl 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-50 dark:bg-slate-805 text-slate-705 dark:text-slate-350 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {rl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Change Subscription Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['None', 'Basic', 'Standard', 'Premium'].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => setProfile(prev => ({ ...prev, subscriptionPlan: sc as any }))}
                      className={`py-1 px-1 rounded-md text-[10px] font-bold cursor-pointer border ${
                        profile.subscriptionPlan === sc 
                          ? 'bg-purple-600 text-white border-purple-650' 
                          : 'bg-slate-50 dark:bg-slate-805 text-slate-705 dark:text-slate-350 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setRoleModalOpen(false)}
              className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer"
            >
              Verify Changes
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Header Block shown strictly on the Home View */}
      {currentTab === 'home' && (
        <Hero 
          onStartLearning={handleStartLearning}
          onWatchDemo={handleWatchDemoVideo}
        />
      )}

      {/* 3. Main Views router switch */}
      <main className="flex-grow transition-colors">
        {currentTab === 'home' && (
          <HomeView
            upcomingClasses={liveClasses}
            popularCourses={courses}
            onTabChange={setCurrentTab}
            onJoinLive={(liveClass) => {
              setActiveClass(liveClass);
              setCurrentTab('live');
            }}
            onSelectCourse={(course) => {
              setCurrentTab('courses');
            }}
            userRole={profile.role}
          />
        )}

        {currentTab === 'courses' && (
          <CoursesView
            courses={courses}
            purchasedCourseIds={purchasedCourseIds}
            onSelectCourse={(course) => {
              setActiveVideo(recordedVideos[0]);
              setCurrentTab('videos');
            }}
            onBuyCourse={(course) => {
              // Trigger Razorpay Modal simulation if they don't have subscription plan
              if (profile.subscriptionPlan === 'None') {
                setCheckoutPlan(SUBSCRIPTION_PLANS[1]);
              } else {
                handleBuyCourse(course);
              }
            }}
          />
        )}

        {currentTab === 'live' && (
          <LiveView
            liveClasses={liveClasses}
            activeClass={activeClass}
            setActiveClass={setActiveClass}
            attendanceCount={attendanceCount}
            setAttendanceCount={setAttendanceCount}
            userRole={profile.role}
            userName={profile.name}
            onUserIncrementXp={handleIncrementXp}
          />
        )}

        {currentTab === 'videos' && (
          <VideoLibraryView
            videos={recordedVideos}
            setVideos={setRecordedVideos}
            onUserIncrementXp={handleIncrementXp}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        )}

        {currentTab === 'subscription' && (
          <PlanView
            plans={SUBSCRIPTION_PLANS}
            selectedPlan={profile.subscriptionPlan}
            onBuyPlan={(plan) => setCheckoutPlan(plan)}
          />
        )}

        {currentTab === 'student-dashboard' && (
          <StudentDashboard
            profile={profile}
            setProfile={setProfile}
            purchasedCourses={courses.filter(c => purchasedCourseIds.includes(c.id))}
            onTabChange={setCurrentTab}
            notifications={notifications}
            clearNotifications={() => setNotifications([])}
          />
        )}

        {currentTab === 'teacher-dashboard' && (
          <TeacherDashboard
            liveClasses={liveClasses}
            setLiveClasses={setLiveClasses}
            recordedVideos={recordedVideos}
            setRecordedVideos={setRecordedVideos}
            onUserIncrementXp={handleIncrementXp}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            initialCourses={courses}
            initialLiveClasses={liveClasses}
            userName={profile.name}
          />
        )}

        {currentTab === 'about' && <AboutView />}

        {currentTab === 'contact' && <ContactView />}

        {currentTab === 'ai-assistant' && (
          <AIWorkspaceView userName={profile.name} />
        )}
      </main>

      {/* 4. Elegant Support Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Sandboxed checkout modal if active */}
      <RazorpayModal
        plan={checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
