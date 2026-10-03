'use client';

import { useState } from 'react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const [values, setValues] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from('contact_messages').insert({
      full_name: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      message: values.message.trim(),
    });

    setLoading(false);

    if (insertError) {
      setError("Couldn't send your message. Please try again, or call us directly.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2 md:px-6">
        <div>
          <h1 className="text-3xl font-extrabold">Contact Us</h1>
          <p className="mt-2 text-sm text-muted">
            Need an electrician or have a question? Send us a service request and our team will reach
            out to you directly.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-sm">
            <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-500" /> Joshuaesan05@gmail.com</span>
            <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-500" /> 0704 788 1457</span>
            <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-500" /> 08101425206</span>
            <span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-500" /> No. 19 Pipeline Road, Eleme, Port Harcourt 500001, Rivers</span>
          </div>
        </div>

        <Card>
          {submitted ? (
            <p className="text-sm">
              Thanks for reaching out — we&apos;ve received your request and an electrician will contact
              you shortly.
            </p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
              )}
              <Input
                label="Full Name"
                required
                placeholder="Your full name"
                value={values.fullName}
                onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              />
              <Input
                label="Phone Number"
                placeholder="So an electrician can call you back"
                value={values.phone}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="What do you need help with?"
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
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
