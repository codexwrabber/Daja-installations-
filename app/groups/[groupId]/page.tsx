'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppSidebar from '@/components/marketing/AppSidebar';
import ChatWindow from '@/components/groups/ChatWindow';
import { createClient } from '@/lib/supabase/client';
import type { Group } from '@/types/database';

export default function GroupDetailPage() {
  const params = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadGroup() {
      const supabase = createClient();
      const { data } = await supabase.from('groups').select('*').eq('id', params.groupId).single();
      if (active) {
        setGroup(data ?? null);
        setLoading(false);
      }
    }
    loadGroup();
    return () => {
      active = false;
    };
  }, [params.groupId]);

  return (
    <div className="flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 p-4">
        {loading ? (
          <p className="text-sm text-muted">Loading group…</p>
        ) : !group ? (
          <p className="text-sm text-muted">Group not found.</p>
        ) : (
          <ChatWindow groupId={group.id} groupName={group.name} />
        )}
      </main>
    </div>
  );
}
