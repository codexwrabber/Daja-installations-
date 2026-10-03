'use client';

import { useState } from 'react';
import { Lock, Phone, Mail } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [requests, setRequests] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRequests(accessCode: string) {
    setLoading(true);
    setError(null);

    const res = await fetch('/api/admin/requests', {
      headers: { 'x-admin-code': accessCode },
    });

    if (!res.ok) {
      setLoading(false);
      setAuthorized(false);
      setError(res.status === 401 ? 'Incorrect access code.' : 'Could not load requests.');
      return;
    }

    const data = await res.json();
    setRequests(data.requests ?? []);
    setAuthorized(true);
    setLoading(false);
  }

  async function updateStatus(id: string, status: ContactMessage['status']) {
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-code': code },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-alt)] px-4">
        <Card className="w-full max-w-sm text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-lg font-bold">Admin Access</h1>
          <p className="mt-1 text-sm text-muted">Enter the admin access code to view service requests.</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
          )}

          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              loadRequests(code);
            }}
          >
            <Input
              type="password"
              placeholder="Access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Continue
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold">Service Requests</h1>
      <p className="mt-1 text-sm text-muted">Customers who submitted the Contact form, newest first.</p>

      {requests.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No requests yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{r.full_name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted"><Mail className="h-3.5 w-3.5" /> {r.email}</p>
                  {r.phone && (
                    <p className="flex items-center gap-1.5 text-xs text-muted"><Phone className="h-3.5 w-3.5" /> {r.phone}</p>
                  )}
                </div>
                <span className="text-xs text-muted">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 text-sm">{r.message}</p>
              <div className="mt-4 flex items-center gap-2">
                {(['new', 'contacted', 'closed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(r.id, s)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-base ${
                      r.status === s
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-[var(--border)] text-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
