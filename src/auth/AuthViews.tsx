import React, { useState } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-500 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Fun With Learn
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-4xl font-black leading-tight">
              Learn smarter.<br />
              Grow faster.<br />
              Stay connected.
            </div>
            <p className="max-w-md text-sm text-indigo-100/90">
              A secure, student-first learning platform for live classrooms, assignments, quizzes, progress tracking, and parent visibility.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-indigo-100">Learning path</div>
            <div className="mt-3 flex items-center gap-3 text-sm text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">✓</span>
              Live classes + recorded lessons
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">✓</span>
              Role-based access for students, teachers, parents, and admins
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-5 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Welcome</div>
              <h1 className="mt-3 text-3xl font-black">{title}</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onAuthSuccess: (user: any) => void;
}

export function LoginPage({ onNavigate, onAuthSuccess }: LoginPageProps) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      const role = data.data.user.role;
      onAuthSuccess(data.data.user);
      const dashboardMap: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard',
        PARENT: '/parent/dashboard',
      };
      onNavigate(dashboardMap[role] || '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Sign in to continue your learning journey.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">Email / User ID</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none ring-0 transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-11 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Remember Me
          </label>
          <button type="button" onClick={() => onNavigate('/forgot-password')} className="font-semibold text-indigo-600 hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          Don’t have an account?{' '}
          <button type="button" onClick={() => onNavigate('/register')} className="font-bold text-indigo-600 hover:underline">
            Register
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export function RegisterPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setMessage('Registration successful. Please verify your email to activate your account.');
      setTimeout(() => onNavigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the Fun With Learn community.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mobile Number</label>
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
            <option value="STUDENT">Student</option>
            <option value="PARENT">Parent</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <button type="button" onClick={() => onNavigate('/login')} className="font-bold text-indigo-600 hover:underline">
            Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export function ForgotPasswordPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to process request.');
      }
      setMessage('If an account exists with this email, a password reset link has been sent.');
    } catch (err: any) {
      setMessage(err.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password?" subtitle="Enter your registered email to receive a reset link.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</div>}
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Sending reset link...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
}

export function ResetPasswordPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = new URLSearchParams(window.location.search).get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Password reset failed.');
      }
      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => onNavigate('/login'), 1200);
    } catch (err: any) {
      setMessage(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Create a strong new password for your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</div>}
        <div>
          <label className="mb-1 block text-sm font-medium">New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" required />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Updating password...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}

export function UnauthorizedPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <AuthLayout title="Access Denied" subtitle="You don’t have permission to access this page.">
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-900">
          You do not have the required role or access level for this area.
        </div>
        <button onClick={() => onNavigate('/login')} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white">
          Go to Dashboard
        </button>
      </div>
    </AuthLayout>
  );
}
