'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthPanel from '@/components/auth/AuthPanel';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { validateRegisterForm, type FieldErrors } from '@/lib/validation/schemas';

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const fieldErrors = validateRegisterForm(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: { data: { full_name: values.fullName.trim() } },
    });

    if (error) {
      setLoading(false);
      setFormError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: values.fullName.trim(),
      });
    }

    setLoading(false);

    // With email confirmation disabled in Supabase, signUp returns an active
    // session immediately and we can send the person straight in. If
    // confirmation is ever turned back on, data.session will be null and we
    // fall back to the "check your email" message instead.
    if (data.session) {
      router.push('/groups');
      router.refresh();
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <AuthPanel active="register">
        <h1 className="text-xl font-bold">Check your email</h1>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve sent a confirmation link to {values.email}. Confirm your email to finish setting up your account.
        </p>
        <Link href="/auth/login" className="mt-6 inline-block text-sm font-semibold text-brand-500">
          Back to login
        </Link>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel active="register">
      <h1 className="text-xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Join the Daja platform in a minute.</p>

      {formError && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{formError}</p>
      )}

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          required
          placeholder="Enter your full name"
          value={values.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
          error={errors.fullName}
        />
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          required
          placeholder="Create a password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          error={errors.password}
        />
        <Button type="submit" loading={loading}>Create Account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-brand-500">
          Login
        </Link>
      </p>
    </AuthPanel>
  );
}
