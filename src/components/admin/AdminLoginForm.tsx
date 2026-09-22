'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const json = await res.json();

        if (!json.success) {
          setError(json.error?.message || 'Login failed. Please try again.');
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } catch {
        setError('Unable to connect to the server. Please try again.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@orionterra.com"
            disabled={isPending}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border text-white placeholder:text-gray-600 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all',
              error ? 'border-red-500/60' : 'border-white/10 hover:border-white/20',
              isPending && 'opacity-60 cursor-not-allowed'
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isPending}
            className={cn(
              'w-full pl-10 pr-11 py-2.5 rounded-lg bg-white/5 border text-white placeholder:text-gray-600 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all',
              error ? 'border-red-500/60' : 'border-white/10 hover:border-white/20',
              isPending && 'opacity-60 cursor-not-allowed'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        id="admin-login-btn"
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
          'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/40',
          'hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-900/60',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-[#111C2E]',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none'
        )}
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}
