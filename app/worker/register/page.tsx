import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import WorkerRegisterForm from '@/components/worker/WorkerRegisterForm';

export default function WorkerRegisterPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[var(--bg-alt)] px-4 py-12 md:px-6">
        <WorkerRegisterForm />
      </main>
      <Footer />
    </>
  );
}
