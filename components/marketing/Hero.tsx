import Link from 'next/link';
import { ShieldCheck, BadgeCheck, Headphones, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';

const trustItems = [
  { icon: BadgeCheck, title: 'Verified Workers', desc: 'Skilled and background checked' },
  { icon: ShieldCheck, title: 'Quality Assurance', desc: 'We deliver as promised' },
  { icon: Headphones, title: '24/7 Support', desc: "We're always here to help" },
  { icon: Lock, title: 'Secure & Reliable', desc: 'Your safety is our priority' },
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600">
        Reliable • Professional • Trusted
      </span>
      <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight md:text-5xl">
        Daja Installation <span className="text-brand-500">Services</span>
      </h1>
      <p className="mt-3 text-lg font-medium text-muted">Skilled hands. Quality work. Lasting solutions.</p>
      <p className="mt-2 max-w-lg text-sm text-muted">
        We provide professional installation services and skilled worker support for your home, office and business needs.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/worker/register">
          <Button variant="primary">Get Started</Button>
        </Link>
        <Link href="/services">
          <Button variant="outline">Learn More</Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {trustItems.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
