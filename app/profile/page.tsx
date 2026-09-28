'use client';

import { useEffect, useState } from 'react';
import AppSidebar from '@/components/marketing/AppSidebar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/auth/useUser';
import type { Profile, WorkerProfile } from '@/types/database';

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function loadProfile() {
      const supabase = createClient();
      const [{ data: profileData }, { data: workerData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user!.id).single(),
        supabase.from('worker_profiles').select('*').eq('id', user!.id).maybeSingle(),
      ]);

      if (active) {
        setProfile(profileData ?? null);
        setWorker(workerData ?? null);
        setFullName(profileData?.full_name ?? '');
        setPhone(profileData?.phone ?? '');
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSavedMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName.trim(), phone: phone.trim() });
    setSaving(false);
    setSavedMessage(error ? 'Could not save changes.' : 'Profile updated.');
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 px-6 py-6 md:px-8">
        <h1 className="text-2xl font-bold">Profile</h1>

        {userLoading ? (
          <p className="mt-6 text-sm text-muted">Loading profile…</p>
        ) : (
          <div className="mt-6 grid max-w-3xl gap-6 md:grid-cols-2">
            <Card>
              <h2 className="font-semibold">Account Information</h2>
              <div className="mt-4 flex flex-col gap-4">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input label="Email Address" value={user?.email ?? ''} disabled />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {savedMessage && <p className="text-xs text-muted">{savedMessage}</p>}
                <Button onClick={handleSave} loading={saving} type="button">
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card>
              <h2 className="font-semibold">Worker Status</h2>
              {worker ? (
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Registration</span>
                    <span className="capitalize">{worker.registration_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Payment</span>
                    <span className="capitalize">{worker.payment_status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Location</span>
                    <span>{worker.location ?? '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted">Skills</span>
                    <p className="mt-1">{worker.skills?.join(', ') || '—'}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  You haven&apos;t registered as a worker yet.
                </p>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
