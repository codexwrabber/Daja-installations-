'use client';

import { useState } from 'react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // MVP: no backend endpoint yet — replace with a Supabase table or email service later.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2 md:px-6">
        <div>
          <h1 className="text-3xl font-extrabold">Contact Us</h1>
          <p className="mt-2 text-sm text-muted">
            Have a question or need a service? Reach out and our team will get back to you shortly.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-sm">
            <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-500" /> hello@daja.services</span>
            <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-500" /> +234 800 000 0000</span>
            <span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-500" /> Lekki Phase 1, Lagos</span>
          </div>
        </div>

        <Card>
          {submitted ? (
            <p className="text-sm">Thanks for reaching out — we'll be in touch soon.</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input label="Full Name" required placeholder="Your full name" />
              <Input label="Email Address" type="email" required placeholder="you@example.com" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/60"
                />
              </div>
              <Button type="submit" loading={loading}>Send Message</Button>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </>
  );
}
