import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import Hero from '@/components/marketing/Hero';
import Card from '@/components/ui/Card';
import { Zap, Video, Wind, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  { icon: Zap, title: 'Electrical Installation', desc: 'Safe and efficient electrical solutions.' },
  { icon: Video, title: 'CCTV Installation', desc: 'Keep your property secure.' },
  { icon: Wind, title: 'Air Conditioning', desc: 'Stay cool all year round.' },
  { icon: Wrench, title: 'General Installations', desc: 'Home, office & business solutions.' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <h2 className="text-2xl font-bold">Our Services</h2>
          <p className="mt-1 text-sm text-muted">Professional installation and support services for your needs.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="group cursor-pointer">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="font-semibold">{title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted transition-base group-hover:translate-x-1" />
                </div>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <Card className="flex flex-col items-center gap-4 bg-brand-500 !border-brand-500 py-10 text-center text-white">
            <h2 className="text-2xl font-bold">Ready to build your skills with Daja?</h2>
            <p className="max-w-md text-sm text-white/90">
              Join our community of skilled workers and get access to real opportunities, training and job placements.
            </p>
            <Link href="/worker/register">
              <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition-base hover:bg-white/90">
                Join as a Worker
              </button>
            </Link>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
