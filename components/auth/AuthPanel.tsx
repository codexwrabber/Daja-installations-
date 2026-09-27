import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthPanel({
  active,
  children,
}: {
  active: 'login' | 'register';
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-alt)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Zap className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Daja</span>
            <span className="block text-[11px] text-muted">Installation Services</span>
          </span>
        </div>

        <div className="card rounded-2xl p-6 shadow-card">
          <div className="mb-6 flex gap-6 border-b border-[var(--border)]">
            <Link
              href="/auth/login"
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
                active === 'login' ? 'border-brand-500 text-brand-500' : 'border-transparent text-muted'
              }`}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
                active === 'register' ? 'border-brand-500 text-brand-500' : 'border-transparent text-muted'
              }`}
            >
              Register
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
