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
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './auth/AuthViews';

import {
  INITIAL_COURSES,
  INITIAL_LIVE_CLASSES,
  INITIAL_RECORDED_VIDEOS,
  SUBSCRIPTION_PLANS,
} from './data';
import { UserProfile, Course, LiveClass, RecordedVideo, SubscriptionPlan } from './types';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
};

const roleDashboardMap: Record<AuthUser['role'], string> = {
  ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
  PARENT: '/parent/dashboard',
};

const normalizePath = (path: string) => {
  if (!path || path === '/') return '/';
  const next = path.split('?')[0].split('#')[0];
  return next.startsWith('/') ? next : `/${next}`;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [route, setRoute] = useState<string>(() => normalizePath(window.location.pathname));
  const [dashboardData, setDashboardData] = useState<Record<string, any>>({});

  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [liveClasses] = useState<LiveClass[]>(INITIAL_LIVE_CLASSES);
  const [recordedVideos] = useState<RecordedVideo[]>(INITIAL_RECORDED_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<RecordedVideo | null>(null);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [attendanceCount, setAttendanceCount] = useState<number>(342);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    mobile: '',
    role: 'student',
    subscriptionPlan: 'None',
    progress: 0,
    completedHours: 0,
    totalXP: 0,
  });
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(['course-1', 'course-2']);
  const [notifications, setNotifications] = useState<string[]>([
    'Dr. Ramesh Sharma added Advanced Mathematics resources for Boards preparation.',
    'Your live physics review session is starting tomorrow morning at 09:30 AM.',
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navigateTo = (nextPath: string) => {
    const clean = normalizePath(nextPath);
    window.history.pushState({}, '', clean);
    setRoute(clean);
  };

  const redirectToDashboard = (role: AuthUser['role']) => {
    const target = roleDashboardMap[role];
    window.history.replaceState({}, '', target);
    setRoute(target);
    setCurrentTab(
      role === 'ADMIN'
        ? 'admin-dashboard'
        : role === 'TEACHER'
          ? 'teacher-dashboard'
          : role === 'PARENT'
            ? 'student-dashboard'
            : 'student-dashboard',
    );
  };

  const handleAuthSuccess = (user: { id: string; name: string; email: string; role: string }) => {
    const normalizedRole = String(user.role).toUpperCase() as AuthUser['role'];
    const nextUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizedRole,
    };
    setAuthUser(nextUser);
    setProfile((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      role: normalizedRole.toLowerCase() as UserProfile['role'],
      subscriptionPlan: 'Premium',
      progress: 45,
      completedHours: 12,
      totalXP: 450,
    }));
    redirectToDashboard(normalizedRole);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore logout API failure for the client redirect
    }
    setAuthUser(null);
    setProfile({
      name: '',
      email: '',
      mobile: '',
      role: 'student',
      subscriptionPlan: 'None',
      progress: 0,
      completedHours: 0,
      totalXP: 0,
    });
    window.history.replaceState({}, '', '/login');
    setRoute('/login');
    setCurrentTab('home');
  };

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const syncRoute = () => setRoute(normalizePath(window.location.pathname));
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => {
    let ignore = false;

    const verifySession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const payload = await response.json();
        if (ignore || !payload?.authenticated || !payload?.user) {
          return;
        }
        const user = payload.user as AuthUser;
        const normalizedRole = String(user.role).toUpperCase() as AuthUser['role'];
        if (ignore) return;
        setAuthUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: normalizedRole,
        });
        setProfile((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          role: normalizedRole.toLowerCase() as UserProfile['role'],
          subscriptionPlan: 'Premium',
          progress: 45,
          completedHours: 12,
          totalXP: 450,
        }));
      } catch {
        setAuthUser(null);
      } finally {
        if (!ignore) setAuthReady(true);
      }
    };

    verifySession();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !authUser) return;

    const roleKey = authUser.role.toLowerCase();
    fetch(`/api/dashboard/${roleKey}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (data?.success) {
          setDashboardData((prev) => ({ ...prev, [roleKey]: data.data }));
        }
      })
      .catch(() => undefined);
  }, [authReady, authUser]);

  useEffect(() => {
    if (!authReady) return;

    const path = normalizePath(route);

    // Define public routes (accessible to everyone)
    const publicRoutes = ['/', '/classes', '/programs', '/about', '/how-it-works', '/contact', '/pricing', '/faq', '/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.some((pub) => path === pub || (pub === '/forgot-password' && path.startsWith('/reset-password')));

    // Define protected route prefixes (require authentication)
    const protectedPrefixes = ['/admin', '/teacher', '/student', '/parent', '/dashboard', '/my-learning', '/live-class', '/assignments', '/tests', '/results', '/payments'];
    const isProtectedRoute = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

    // Case 1: Not authenticated
    if (!authUser) {
      // If trying to access protected route, redirect to login
      if (isProtectedRoute) {
        if (path !== '/login') {
          window.history.replaceState({}, '', `/login?redirect=${encodeURIComponent(path)}`);
          setRoute('/login');
        }
      }
      // Otherwise, allow access to public routes (do nothing)
      return;
    }

    // Case 2: Authenticated user
    // Allow all public routes (user can browse public site even when logged in)
    if (isPublicRoute) {
      // Don't automatically redirect away from public pages
      // User can browse public content even when authenticated
      return;
    }

    // Enforce role-based access to protected routes
    if (path.startsWith('/admin')) {
      if (authUser.role !== 'ADMIN') {
        window.history.replaceState({}, '', roleDashboardMap[authUser.role]);
        setRoute(roleDashboardMap[authUser.role]);
      }
      return;
    }

    if (path.startsWith('/teacher')) {
      if (authUser.role !== 'TEACHER') {
        window.history.replaceState({}, '', roleDashboardMap[authUser.role]);
        setRoute(roleDashboardMap[authUser.role]);
      }
      return;
    }

    if (path.startsWith('/student')) {
      if (authUser.role !== 'STUDENT') {
        window.history.replaceState({}, '', roleDashboardMap[authUser.role]);
        setRoute(roleDashboardMap[authUser.role]);
      }
      return;
    }

    if (path.startsWith('/parent')) {
      if (authUser.role !== 'PARENT') {
        window.history.replaceState({}, '', roleDashboardMap[authUser.role]);
        setRoute(roleDashboardMap[authUser.role]);
      }
      return;
    }

    if (path.startsWith('/dashboard')) {
      const target = roleDashboardMap[authUser.role];
      if (path !== target) {
        window.history.replaceState({}, '', target);
        setRoute(target);
      }
      return;
    }
  }, [authReady, authUser, route]);

  const handlePaymentSuccess = (planTier: 'Basic' | 'Standard' | 'Premium') => {
    setProfile((prev) => ({
      ...prev,
      subscriptionPlan: planTier,
    }));
    setNotifications((prev) => [
      `Subscription Plan updated successfully to ${planTier}! Welcome to Fun With Learn Premium features.`,
      ...prev,
    ]);
    alert(`Success! Sandboxed checkout complete. Account tier upgraded to ${planTier}.`);
  };

  const handleBuyCourse = (course: Course) => {
    setPurchasedCourseIds((prev) => [...prev, course.id]);
    setNotifications((prev) => [
      `Enrolled successfully in certified syllabus pack: "${course.name}"!`,
      ...prev,
    ]);
    setProfile((prev) => ({ ...prev, totalXP: prev.totalXP + 100 }));
    alert(`Successful mock purchase! "${course.name}" is now unlocked in your Student Portal.`);
  };

  const handleIncrementXp = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      totalXP: prev.totalXP + amount,
      completedHours: prev.completedHours + (amount > 100 ? 1 : 0.5),
    }));
  };

  const handleStartLearning = () => {
    setCurrentTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchDemoVideo = () => {
    if (recordedVideos.length > 0) {
      setActiveVideo(recordedVideos[0]);
      setCurrentTab('videos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent mx-auto" />
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Checking session</p>
        </div>
      </div>
    );
  }

  // Show auth pages for unauthenticated users
  if (!authUser && (route === '/login' || route === '/register' || route === '/forgot-password' || route.startsWith('/reset-password'))) {
    if (route === '/login') {
      return <LoginPage onNavigate={navigateTo} onAuthSuccess={handleAuthSuccess} />;
    }
    if (route === '/register') {
      return <RegisterPage onNavigate={navigateTo} />
    }
    if (route === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigateTo} />;
    }
    if (route.startsWith('/reset-password')) {
      return <ResetPasswordPage onNavigate={navigateTo} />;
    }
  }

  // Redirect unauthenticated users to login if accessing protected routes
  if (!authUser && (route.startsWith('/admin') || route.startsWith('/teacher') || route.startsWith('/student') || route.startsWith('/parent') || route.startsWith('/dashboard'))) {
    if (route !== '/login') {
      return <LoginPage onNavigate={navigateTo} onAuthSuccess={handleAuthSuccess} />;
    }
  }

  const activeRole = authUser?.role.toUpperCase();
  const dashboardTab =
    activeRole === 'ADMIN'
      ? 'admin-dashboard'
      : activeRole === 'TEACHER'
        ? 'teacher-dashboard'
        : 'student-dashboard';

  if (authUser && (route === '/student/dashboard' || route === '/teacher/dashboard' || route === '/admin/dashboard' || route === '/parent/dashboard')) {
    setCurrentTab(dashboardTab);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 transition-colors duration-200">
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
        onLogout={handleLogout}
        isAuthenticated={!!authUser}
      />

      {notificationsOpen && (
        <div className="absolute right-6 top-16 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-4 rounded-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Push Messages Inbox</span>
            <button onClick={() => setNotifications([])} className="text-[10px] text-red-500 font-mono font-bold hover:underline">Clear</button>
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

      {roleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl max-w-sm w-full space-y-6">
            <div>
              <h3 className="font-sans font-extrabold text-slate-950 dark:text-slate-50 text-base">User Sandbox Switcher</h3>
              <p className="text-xs text-slate-400 mt-1">Interchange student, teacher, or admin roles and test matching dashboards.</p>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Change Active Portal Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['student', 'teacher', 'admin', 'parent'].map((rl) => (
                    <button
                      key={rl}
                      onClick={() => setProfile((prev) => ({
                        ...prev,
                        role: rl as any,
                        name: rl === 'student' ? 'Suhani Malhotra' : rl === 'teacher' ? 'Dr. Ramesh Sharma' : rl === 'admin' ? 'Platform Owner' : 'Aarav Malhotra',
                        classLevel: rl === 'parent' ? 'Class 5' : prev.classLevel || 'Class 10',
                      }))}
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
            </div>
            <button onClick={() => setRoleModalOpen(false)} className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer">Verify Changes</button>
          </div>
        </div>
      )}

      {currentTab === 'home' && (
        <>
          <Hero onStartLearning={handleStartLearning} onWatchDemo={handleWatchDemoVideo} />
          <HomeView
            upcomingClasses={liveClasses}
            popularCourses={courses}
            onTabChange={setCurrentTab}
            onJoinLive={(liveClass) => {
              if (!authUser) {
                navigateTo('/login');
                return;
              }
              setActiveClass(liveClass);
              setCurrentTab('live');
            }}
            onSelectCourse={() => setCurrentTab('courses')}
            userRole={authUser ? profile.role : 'guest'}
          />
        </>
      )}

      <main className="flex-grow transition-colors">


        {currentTab === 'courses' && (
          <CoursesView
            courses={courses}
            purchasedCourseIds={purchasedCourseIds}
            onSelectCourse={() => {
              setActiveVideo(recordedVideos[0]);
              setCurrentTab('videos');
            }}
            onBuyCourse={(course) => {
              if (!authUser) {
                navigateTo('/login?redirect=/courses');
                return;
              }
              if (profile.subscriptionPlan === 'None') {
                setCheckoutPlan(SUBSCRIPTION_PLANS[1]);
              } else {
                handleBuyCourse(course);
              }
            }}
          />
        )}

        {currentTab === 'programs' && (
          <CoursesView
            courses={courses}
            purchasedCourseIds={purchasedCourseIds}
            onSelectCourse={() => {
              setActiveVideo(recordedVideos[0]);
              setCurrentTab('videos');
            }}
            onBuyCourse={(course) => {
              if (!authUser) {
                navigateTo('/login?redirect=/programs');
                return;
              }
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
            setVideos={() => null}
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
            purchasedCourses={courses.filter((c) => purchasedCourseIds.includes(c.id))}
            onTabChange={setCurrentTab}
            notifications={notifications}
            clearNotifications={() => setNotifications([])}
            summary={dashboardData.student}
          />
        )}

        {currentTab === 'teacher-dashboard' && (
          <TeacherDashboard
            liveClasses={liveClasses}
            setLiveClasses={() => null}
            recordedVideos={recordedVideos}
            setRecordedVideos={() => null}
            onUserIncrementXp={handleIncrementXp}
            summary={dashboardData.teacher}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            initialCourses={courses}
            initialLiveClasses={liveClasses}
            userName={profile.name}
            summary={dashboardData.admin}
          />
        )}

        {currentTab === 'about' && <AboutView />}
        {currentTab === 'contact' && <ContactView />}
        {currentTab === 'ai-assistant' && authUser && <AIWorkspaceView userName={profile.name} />}
      </main>

      <Footer setCurrentTab={setCurrentTab} />

      <RazorpayModal
        plan={checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
