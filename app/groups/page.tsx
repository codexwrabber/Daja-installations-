'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import AppSidebar from '@/components/marketing/AppSidebar';
import GroupCard from '@/components/groups/GroupCard';
import CreateGroupModal from '@/components/groups/CreateGroupModal';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/auth/useUser';
import type { Group } from '@/types/database';

type Tab = 'all' | 'mine' | 'joined';

interface GroupWithMeta extends Group {
  memberCount: number;
  joined: boolean;
}

export default function GroupsPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<GroupWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadGroups() {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      const { data: groupRows, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupsError) {
        if (active) {
          setError('Could not load groups. Please try again.');
          setLoading(false);
        }
        return;
      }

      const { data: memberRows } = await supabase
        .from('group_members')
        .select('group_id, user_id');

      const countByGroup = new Map<string, number>();
      const joinedIds = new Set<string>();
      (memberRows ?? []).forEach((m) => {
        countByGroup.set(m.group_id, (countByGroup.get(m.group_id) ?? 0) + 1);
        if (user && m.user_id === user.id) joinedIds.add(m.group_id);
      });

      if (active) {
        setGroups(
          (groupRows ?? []).map((g) => ({
            ...g,
            memberCount: countByGroup.get(g.id) ?? 0,
            joined: joinedIds.has(g.id),
          }))
        );
        setLoading(false);
      }
    }

    loadGroups();
    return () => {
      active = false;
    };
  }, [user]);

  async function toggleJoin(groupId: string) {
    if (!user) return;
    const supabase = createClient();
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.joined) {
      await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', user.id);
    } else {
      await supabase.from('group_members').insert({ group_id: groupId, user_id: user.id, role: 'member' });
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, joined: !g.joined, memberCount: g.memberCount + (g.joined ? -1 : 1) }
          : g
      )
    );
  }

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
      const matchesTab =
        tab === 'all' || (tab === 'joined' && g.joined) || (tab === 'mine' && g.owner_id === user?.id);
      return matchesSearch && matchesTab;
    });
  }, [groups, search, tab, user]);

  return (
    <div className="flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Groups</h1>
          <Button className="gap-1.5" onClick={() => setShowCreateModal(true)} disabled={!user}>
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-4 flex gap-6 border-b border-[var(--border)]">
          {(['all', 'mine', 'joined'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-2.5 text-sm font-medium capitalize ${
                tab === t ? 'border-brand-500 text-brand-500' : 'border-transparent text-muted'
              }`}
            >
              {t === 'all' ? 'All Groups' : t === 'mine' ? 'My Groups' : 'Joined'}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-muted">Loading groups…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No groups found.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((g) => (
              <GroupCard
                key={g.id}
                id={g.id}
                name={g.name}
                description={g.description ?? ''}
                memberCount={g.memberCount}
                joined={g.joined}
                onJoinToggle={toggleJoin}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && user && (
        <CreateGroupModal
          userId={user.id}
          onClose={() => setShowCreateModal(false)}
          onCreated={(group) => {
            setGroups((prev) => [{ ...group, memberCount: 1, joined: true }, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
