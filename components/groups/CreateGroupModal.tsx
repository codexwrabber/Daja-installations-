'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Group } from '@/types/database';

interface CreateGroupModalProps {
  userId: string;
  onClose: () => void;
  onCreated: (group: Group) => void;
}

export default function CreateGroupModal({ userId, onClose, onCreated }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name: name.trim(), description: description.trim() || null, owner_id: userId })
      .select()
      .single();

    if (groupError || !group) {
      setLoading(false);
      setError("Couldn't create the group. Please try again.");
      return;
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId, role: 'owner' });

    setLoading(false);

    if (memberError) {
      setError('Group was created, but adding you as a member failed. Try refreshing.');
      return;
    }

    onCreated(group);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Create Group</h2>
          <button aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleCreate}>
          <Input
            label="Group Name"
            required
            placeholder="e.g. Electrical Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={3}
              placeholder="What's this group for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/60"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
