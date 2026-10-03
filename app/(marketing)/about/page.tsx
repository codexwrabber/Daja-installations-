import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import Card from '@/components/ui/Card';

const values = [
  { title: 'Reliability', desc: 'We show up on time and deliver on our promises, every time.' },
  { title: 'Professionalism', desc: 'Every worker on our platform is vetted, trained and accountable.' },
  { title: 'Trust', desc: 'We build long-term relationships with clients and workers alike.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <h1 className="text-3xl font-extrabold">About Daja Installation Services</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          DAJA Electrical Installations Ltd was co-founded by{' '}
          <span className="font-semibold text-[var(--text)]">Joshua Oluwadamilare Esan</span> (Epe, Ekiti
          State) and <span className="font-semibold text-[var(--text)]">Israel Adeshina Adegbemiro</span>{' '}
          (Oyo State). As Co-Directors, they lead electrical contracting services in Port Harcourt, Rivers
          State — specializing in house wiring, industrial installation, solar inverter systems and
          maintenance.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Daja Installation Services connects homes and businesses with verified, skilled workers for
          electrical, CCTV, air conditioning and general installation needs. We also support our workforce
          with training, community and real job opportunities so they can grow their careers.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title}>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted">{v.desc}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
