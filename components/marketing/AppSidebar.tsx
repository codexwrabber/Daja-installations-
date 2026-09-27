'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, Users, HardHat, MessageSquare, User, Settings, LogOut, Zap, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/auth/useUser';

const navItems = [
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/workers', label: 'Workers', icon: HardHat },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Daja</span>
            <span className="block text-[11px] text-muted">Installation Services</span>
          </span>
        </Link>
        <button aria-label="Close menu" className="md:hidden" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-base hover:bg-[var(--bg-alt)]"
        >
          <Home className="h-4 w-4" /> Home
        </Link>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-base ${
                active ? 'bg-brand-500 text-white' : 'text-muted hover:bg-[var(--bg-alt)]'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-[var(--border)] p-3">
        <p className="truncate text-sm font-semibold">{user?.user_metadata?.full_name ?? 'John Doe'}</p>
        <p className="truncate text-xs text-muted">{user?.email ?? 'john@example.com'}</p>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-2 text-xs font-medium text-red-500"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="text-sm font-bold">Daja</span>
        </Link>
        <button aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Off-canvas drawer on mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-[var(--bg)] p-4 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Static sidebar on md+ */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)] p-4 md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
