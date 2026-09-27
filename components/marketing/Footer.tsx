import Link from 'next/link';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Zap className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-bold">Daja</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Skilled hands. Quality work. Lasting solutions.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Get Involved</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/worker/register">Join as a Worker</Link>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Create an Account</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@daja.services</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +234 800 000 0000</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lekki Phase 1, Lagos</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Daja Installation Services. All rights reserved.
      </div>
    </footer>
  );
}
