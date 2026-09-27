'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/auth/useUser';
import type { Message } from '@/types/database';

interface ChatWindowProps {
  groupId: string;
  groupName: string;
}

interface DisplayMessage extends Message {
  senderName: string;
}

export default function ChatWindow({ groupId, groupName }: ChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadMembersAndMessages() {
      setLoading(true);

      // Build a sender_id -> name lookup from the group's members first, so
      // both the initial load and any realtime inserts can resolve names.
      const { data: memberRows } = await supabase
        .from('group_members')
        .select('user_id, profiles!group_members_user_id_fkey(full_name)')
        .eq('group_id', groupId);

      const nameMap = new Map<string, string>();
      (memberRows ?? []).forEach((row: any) => {
        nameMap.set(row.user_id, row.profiles?.full_name ?? 'Member');
      });
      namesRef.current = nameMap;

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (active) {
        setMessages(
          (data ?? []).map((m: Message) => ({
            ...m,
            senderName: nameMap.get(m.sender_id) ?? 'Member',
          }))
        );
        setLoading(false);
      }
    }

    loadMembersAndMessages();

    const channel = supabase
      .channel(`messages:${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [
            ...prev,
            { ...newMessage, senderName: namesRef.current.get(newMessage.sender_id) ?? 'Member' },
          ]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const supabase = createClient();
    const content = text.trim();
    setText('');

    const { error } = await supabase.from('messages').insert({
      group_id: groupId,
      sender_id: user.id,
      content,
    });

    if (error) {
      setText(content);
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-2xl border border-[var(--border)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">{groupName}</h2>
          <p className="text-xs text-muted">Group chat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-sm text-muted">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet. Say hello 👋</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const isMe = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    isMe ? 'bg-brand-500 text-white' : 'card'
                  }`}>
                    {!isMe && <p className="mb-0.5 text-xs font-semibold text-brand-500">{m.senderName}</p>}
                    <p>{m.content}</p>
                    <p className={`mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-muted'}`}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3">
        <button type="button" className="text-muted">
          <Paperclip className="h-4.5 w-4.5" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/60"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
