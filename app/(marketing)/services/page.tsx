import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import Card from '@/components/ui/Card';
import { Zap, Video, Wind, Wrench } from 'lucide-react';

const services = [
  { icon: Zap, title: 'Electrical Installation', desc: 'Wiring, fittings, panel upgrades and safety inspections for homes and businesses.' },
  { icon: Video, title: 'CCTV Installation', desc: 'Camera setup, monitoring configuration and ongoing maintenance for your property.' },
  { icon: Wind, title: 'Solar And Inverter Installation', desc: 'Installation, installation and repair of inverter units.' },
  { icon: Wrench, title: 'General Installations', desc: 'Plumbing, construction support and other installation services on request.' },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h1 className="text-3xl font-extrabold">Our Services</h1>
        <p className="mt-2 text-sm text-muted">Professional installation and support services for your home, office and business.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
