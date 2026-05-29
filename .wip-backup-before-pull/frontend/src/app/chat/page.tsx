'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

interface ThreadRow {
  id: string;
  other_id: string;
  other_name: string;
  other_username: string | null;
  muted: boolean;
  last_message_at: string;
  last_read_at: string;
  last_message_body: string | null;
  last_message_sender_id: string | null;
  unread_count: number;
}

interface UserSearchResult {
  id: string;
  name: string | null;
  username: string | null;
}

export default function ChatListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'inbox' | 'archive'>('inbox');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      if (!user) return;
      const [threadsRes, statesRes, messagesRes] = await Promise.all([
        supabase
          .from('chat_threads')
          .select('id, user_a_id, user_b_id, last_message_at')
          .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`),
        supabase
          .from('chat_participant_state')
          .select('thread_id, muted, last_read_at')
          .eq('user_id', user.id),
        supabase
          .from('chat_messages')
          .select('id, thread_id, sender_id, body, created_at')
          .order('created_at', { ascending: true }),
      ]);

      const threadsData = threadsRes.data ?? [];
      if (threadsData.length === 0) {
        setThreads([]);
        setLoading(false);
        return;
      }

      const otherIds = new Set<string>();
      threadsData.forEach((t) => {
        otherIds.add(t.user_a_id === user.id ? t.user_b_id : t.user_a_id);
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, username')
        .in('id', Array.from(otherIds));

      const profileById = new Map<string, { name: string | null; username: string | null }>();
      profiles?.forEach((p) => profileById.set(p.id, { name: p.name, username: p.username }));

      const stateByThread = new Map<string, { muted: boolean; last_read_at: string }>();
      statesRes.data?.forEach((s) =>
        stateByThread.set(s.thread_id, { muted: s.muted, last_read_at: s.last_read_at })
      );

      // Group messages by thread
      const msgsByThread = new Map<
        string,
        { id: string; sender_id: string; body: string; created_at: string }[]
      >();
      messagesRes.data?.forEach((m) => {
        const arr = msgsByThread.get(m.thread_id) ?? [];
        arr.push(m);
        msgsByThread.set(m.thread_id, arr);
      });

      const rows: ThreadRow[] = threadsData.map((t) => {
        const other_id = t.user_a_id === user.id ? t.user_b_id : t.user_a_id;
        const prof = profileById.get(other_id);
        const state = stateByThread.get(t.id) ?? { muted: false, last_read_at: t.last_message_at };
        const msgs = msgsByThread.get(t.id) ?? [];
        const last = msgs[msgs.length - 1];
        const lastReadDate = new Date(state.last_read_at).getTime();
        const unread = msgs.filter(
          (m) => m.sender_id !== user.id && new Date(m.created_at).getTime() > lastReadDate
        ).length;

        return {
          id: t.id,
          other_id,
          other_name: prof?.name ?? prof?.username ?? 'Unknown user',
          other_username: prof?.username ?? null,
          muted: state.muted,
          last_message_at: t.last_message_at,
          last_read_at: state.last_read_at,
          last_message_body: last?.body ?? null,
          last_message_sender_id: last?.sender_id ?? null,
          unread_count: unread,
        };
      });

      rows.sort((a, b) => (a.last_message_at < b.last_message_at ? 1 : -1));
      setThreads(rows);
      setLoading(false);
    }

    load();
  }, [user]);

  // User search (debounced)
  useEffect(() => {
    if (!user) return;
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, username')
        .neq('id', user.id)
        .or(`name.ilike.%${q}%,username.ilike.%${q}%`)
        .limit(8);
      if (cancelled) return;
      setSearchResults(data ?? []);
      setSearching(false);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery, user]);

  async function startChat(otherUserId: string) {
    setStartingChat(otherUserId);
    const res = await fetch('/api/chat/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ other_user_id: otherUserId }),
    });
    setStartingChat(null);
    if (!res.ok) return;
    const { id } = await res.json();
    router.push(`/chat/${id}`);
  }

  const inbox = useMemo(() => threads.filter((t) => !t.muted), [threads]);
  const archive = useMemo(() => threads.filter((t) => t.muted), [threads]);
  const visible = tab === 'inbox' ? inbox : archive;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />

      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Dashboard</span>
          </Link>
          <h1 className="text-[#f0f6fc] font-semibold">Messages</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* New chat */}
        <section>
          <label className="block text-[#c9d1d9] text-sm font-medium mb-1">
            Start a new chat
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name or username..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
          />
          {searchQuery.trim().length >= 2 && (
            <div className="mt-2 border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
              {searching ? (
                <p className="px-3 py-2 text-[#8b949e] text-xs">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-2 text-[#8b949e] text-xs">No matches.</p>
              ) : (
                <ul>
                  {searchResults.map((u) => (
                    <li
                      key={u.id}
                      className="px-3 py-2 border-b border-[#21262d] last:border-0 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-[#f0f6fc] truncate">
                          {u.name ?? u.username ?? 'Unnamed user'}
                        </p>
                        {u.username && u.name && (
                          <p className="text-[11px] text-[#8b949e] truncate">@{u.username}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => startChat(u.id)}
                        disabled={startingChat === u.id}
                        className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
                      >
                        {startingChat === u.id ? '...' : 'Message'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#30363d]">
          <TabButton
            active={tab === 'inbox'}
            onClick={() => setTab('inbox')}
            label="Inbox"
            count={inbox.length}
          />
          <TabButton
            active={tab === 'archive'}
            onClick={() => setTab('archive')}
            label="Archive"
            count={archive.length}
          />
        </div>

        {/* List */}
        {loading ? (
          <p className="text-[#8b949e] text-sm">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="text-[#8b949e] text-sm border border-dashed border-[#30363d] rounded-md px-4 py-6 text-center">
            {tab === 'inbox'
              ? 'No conversations yet. Start one above.'
              : 'Nothing archived.'}
          </p>
        ) : (
          <ul className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
            {visible.map((t) => (
              <li
                key={t.id}
                className="border-b border-[#21262d] last:border-0 hover:bg-[#161b22] transition-colors"
              >
                <Link href={`/chat/${t.id}`} className="block px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[#f0f6fc] font-semibold text-sm truncate">
                          {t.other_name}
                        </span>
                        {t.muted && (
                          <span className="text-[10px] text-[#8b949e] border border-[#30363d] rounded-full px-1.5 py-0.5">
                            muted
                          </span>
                        )}
                      </div>
                      <p className="text-[#8b949e] text-xs truncate">
                        {t.last_message_body
                          ? `${t.last_message_sender_id === user.id ? 'You: ' : ''}${t.last_message_body}`
                          : 'No messages yet'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] text-[#8b949e]">
                        {new Date(t.last_message_at).toLocaleDateString()}
                      </span>
                      {t.unread_count > 0 && (
                        <span className="text-[10px] bg-[#1f6feb] text-white font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                          {t.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
        active
          ? 'text-[#f0f6fc] border-[#f78166] font-semibold'
          : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
      }`}
    >
      {label}{' '}
      <span className="text-[11px] text-[#8b949e]">({count})</span>
    </button>
  );
}
