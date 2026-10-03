'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { validateWorkerForm, type FieldErrors } from '@/lib/validation/schemas';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Skills & Experience' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review' },
];

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  skills: string;
  experience: string;
}

const initialValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  countryCode: '+234',
  dateOfBirth: '',
  gender: '',
  location: '',
  skills: '',
  experience: '',
};

export default function WorkerRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [documents, setDocuments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function goNext() {
    if (step === 1) {
      const stepErrors = validateWorkerForm(values);
      const relevant = ['fullName', 'email', 'password', 'phone', 'dateOfBirth', 'gender', 'location'];
      const filtered: FieldErrors = {};
      relevant.forEach((k) => {
        if (stepErrors[k]) filtered[k] = stepErrors[k];
      });
      if (!values.password || values.password.trim().length < 6) {
        filtered.password = 'Password must be at least 6 characters';
      }
      setErrors(filtered);
      if (Object.keys(filtered).length > 0) return;
    }
    if (step === 2) {
      const stepErrors = validateWorkerForm(values);
      const filtered: FieldErrors = {};
      if (stepErrors.skills) filtered.skills = stepErrors.skills;
      if (stepErrors.experience) filtered.experience = stepErrors.experience;
      setErrors(filtered);
      if (Object.keys(filtered).length > 0) return;
    }
    setStep((s) => Math.min(s + 1, steps.length));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    const supabase = createClient();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: { data: { full_name: values.fullName.trim() } },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Could not create your account. Please try again.');

      // RLS requires an authenticated session to write profiles/worker_profiles.
      // With email confirmation disabled in Supabase, signUp() returns a
      // session immediately. If confirmation is ever re-enabled, there is no
      // session yet and the inserts below would be silently rejected — so we
      // stop here with a clear message instead of leaving a half-created account.
      if (!authData.session) {
        throw new Error(
          'Your account was created but needs email confirmation before we can finish your registration. Please confirm your email, then log in and complete your worker profile from the Profile page.'
        );
      }

      await supabase.from('profiles').upsert({
        id: userId,
        full_name: values.fullName.trim(),
        phone: `${values.countryCode}${values.phone}`,
      });

      let uploadedPaths: string[] = [];
      if (documents.length > 0) {
        for (const file of documents) {
          const path = `${userId}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('worker-documents')
            .upload(path, file);
          if (!uploadError) uploadedPaths.push(path);
        }
      }

      const { error: workerError } = await supabase.from('worker_profiles').upsert({
        id: userId,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: values.experience,
        location: values.location,
        date_of_birth: values.dateOfBirth,
        gender: values.gender,
        registration_status: 'submitted',
        payment_status: 'unpaid',
        submitted_at: new Date().toISOString(),
      });
      if (workerError) throw workerError;

      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold">Application Submitted</h2>
        <p className="mt-2 text-sm text-muted">
          Thanks, {values.fullName.split(' ')[0] || 'there'}! We&apos;ve received your worker registration
          and your account is ready to go.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push('/profile')}>
          Go to My Profile
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  step >= s.id ? 'bg-brand-500 text-white' : 'bg-[var(--bg-alt)] text-muted border border-[var(--border)]'
                }`}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </span>
              <span className="text-[11px] text-muted">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className={`mx-2 h-px flex-1 ${step > s.id ? 'bg-brand-500' : 'bg-[var(--border)]'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-bold">Register as a Worker</h2>
        <p className="text-sm text-muted">Fill in your details to join our skilled workforce.</p>

        {submitError && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{submitError}</p>
        )}

        {step === 1 && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Full Name"
                required
                placeholder="Enter your full name"
                value={values.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                error={errors.fullName}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Password"
                type="password"
                required
                placeholder="Create a password to log in later"
                value={values.password}
                onChange={(e) => update('password', e.target.value)}
                error={errors.password}
              />
            </div>
            <Input
              label="Phone Number"
              required
              placeholder="Phone number"
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              value={values.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Gender <span className="text-red-500">*</span></label>
              <select
                value={values.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/60"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
              {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Location"
                required
                placeholder="City / area you work in"
                value={values.location}
                onChange={(e) => update('location', e.target.value)}
                error={errors.location}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 flex flex-col gap-4">
            <Input
              label="Skills"
              required
              placeholder="e.g. Electrical wiring, CCTV setup"
              value={values.skills}
              onChange={(e) => update('skills', e.target.value)}
              error={errors.skills}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Experience <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                placeholder="Describe your years of experience and past work"
                value={values.experience}
                onChange={(e) => update('experience', e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/60"
              />
              {errors.experience && <span className="text-xs text-red-500">{errors.experience}</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-5 flex flex-col gap-3">
            <label className="text-sm font-medium">Supporting Documents (optional)</label>
            <input
              type="file"
              multiple
              onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
              className="rounded-xl border border-dashed border-[var(--border)] px-3.5 py-4 text-sm"
            />
            {documents.length > 0 && (
              <ul className="text-sm text-muted">
                {documents.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted">
              A one-time registration fee applies. Payment instructions will be shared after your application
              is reviewed — no payment is processed on this platform yet.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-muted">Full Name</span><span>{values.fullName || '—'}</span>
              <span className="text-muted">Email</span><span>{values.email || '—'}</span>
              <span className="text-muted">Phone</span><span>{values.countryCode}{values.phone || '—'}</span>
              <span className="text-muted">Date of Birth</span><span>{values.dateOfBirth || '—'}</span>
              <span className="text-muted">Gender</span><span>{values.gender || '—'}</span>
              <span className="text-muted">Location</span><span>{values.location || '—'}</span>
              <span className="text-muted">Skills</span><span>{values.skills || '—'}</span>
              <span className="text-muted">Documents</span><span>{documents.length} file(s)</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={step === 1 || submitting} type="button">
            Back
          </Button>
          {step < steps.length ? (
            <Button onClick={goNext} type="button">Next</Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} type="button">
              Submit Application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
