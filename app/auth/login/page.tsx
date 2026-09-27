'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthPanel from '@/components/auth/AuthPanel';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { validateLoginForm, type FieldErrors } from '@/lib/validation/schemas';

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const fieldErrors = validateLoginForm(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    router.push('/groups');
    router.refresh();
  }

  async function handleOAuth(provider: 'google' | 'azure') {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/groups` },
    });
  }

  return (
    <AuthPanel active="login">
      <h1 className="text-xl font-bold">Welcome Back</h1>
      <p className="mt-1 text-sm text-muted">Sign in to your Daja account</p>

      {formError && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{formError}</p>
      )}

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
        />
        <div>
          <Input
            label="Password"
            type="password"
            required
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            error={errors.password}
          />
          <div className="mt-1.5 text-right">
            <Link href="/auth/forgot-password" className="text-xs font-medium text-brand-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading}>Login</Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-[var(--border)]" />
        OR
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={() => handleOAuth('google')} type="button">
          Continue with Google
        </Button>
        <Button variant="outline" onClick={() => handleOAuth('azure')} type="button">
          Continue with Microsoft
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link href="/auth/register" className="font-semibold text-brand-500">
          Register
        </Link>
      </p>
    </AuthPanel>
  );
}
