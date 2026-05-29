'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

interface Message {
  id: string;
  sender_id: string;
  body: string;
  edited: boolean;
  created_at: string;
  updated_at: string;
}

interface OtherUser {
  id: string;
  name: string | null;
  username: string | null;
}

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const threadId = params?.id;
  const { user } = useAuthenticatedUser();

  const [other, setOther] = useState<OtherUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!threadId) return;
    const { data: thread, error: thErr } = await supabase
      .from('chat_threads')
      .select('id, user_a_id, user_b_id')
      .eq('id', threadId)
      .maybeSingle();
    if (thErr || !thread) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const otherId = thread.user_a_id === user.id ? thread.user_b_id : thread.user_a_id;

    const [profileRes, msgsRes, stateRes] = await Promise.all([
      supabase.from('profiles').select('id, name, username').eq('id', otherId).maybeSingle(),
      supabase
        .from('chat_messages')
        .select('id, sender_id, body, edited, created_at, updated_at')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true }),
      supabase
        .from('chat_participant_state')
        .select('muted')
        .eq('thread_id', threadId)
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    setOther(
      profileRes.data ?? { id: otherId, name: null, username: null }
    );
    setMessages(msgsRes.data ?? []);
    setMuted(stateRes.data?.muted ?? false);
    setLoading(false);
  }, [user, threadId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!threadId || loading || notFound) return;
    fetch(`/api/chat/threads/${threadId}/read`, { method: 'POST' }).catch(() => {});
  }, [threadId, loading, notFound, messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!threadId) return;
    setError(null);
    setSending(true);
    const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: draft }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to send');
      setSending(false);
      return;
    }
    setDraft('');
    setSending(false);
    await load();
  }

  async function toggleMute() {
    if (!threadId) return;
    const res = await fetch(`/api/chat/threads/${threadId}/mute`, { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    setMuted(!!data.muted);
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/chat/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editDraft }),
    });
    if (!res.ok) return;
    setEditingId(null);
    setEditDraft('');
    await load();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-center">
          <p className="text-[#f0f6fc] mb-4">Conversation not found.</p>
          <Link href="/chat" className="text-[#58a6ff] hover:underline text-sm">
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const otherName = other?.name ?? other?.username ?? 'Unknown user';

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />

      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex-1 min-w-0 text-center">
            <p className="text-[#f0f6fc] font-semibold truncate">{otherName}</p>
            {other?.username && other?.name && (
              <p className="text-[11px] text-[#8b949e] truncate">@{other.username}</p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors shrink-0 ${
              muted
                ? 'bg-[#f78166]/20 border-[#f78166] text-[#f78166]'
                : 'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#8b949e]'
            }`}
            title={
              muted
                ? 'Currently archived. Click to move back to inbox.'
                : 'Mute this conversation (moves to Archive). You will still receive messages.'
            }
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-6 flex flex-col min-h-0">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pr-1"
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          {messages.length === 0 ? (
            <p className="text-[#8b949e] text-sm border border-dashed border-[#30363d] rounded-md px-4 py-6 text-center">
              No messages yet. Say hi.
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === user.id;
              const isEditing = editingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      mine
                        ? 'bg-[#1f6feb] text-white'
                        : 'bg-[#21262d] text-[#f0f6fc]'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          rows={2}
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 text-sm text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(m.id)}
                            className="text-xs bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-2 py-0.5 rounded-md transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditDraft('');
                            }}
                            className="text-xs text-[#c9d1d9] hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <div
                          className={`mt-1 flex items-center gap-2 text-[10px] ${
                            mine ? 'text-white/70' : 'text-[#8b949e]'
                          }`}
                        >
                          <span>{new Date(m.created_at).toLocaleString()}</span>
                          {m.edited && <span>· edited</span>}
                          {mine && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(m.id);
                                setEditDraft(m.body);
                              }}
                              className="ml-auto underline hover:no-underline"
                            >
                              edit
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={send} className="mt-4 flex items-start gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !sending && draft.trim()) {
                e.preventDefault();
                send(e);
              }
            }}
            rows={2}
            placeholder="Message... (Enter to send, Shift+Enter for newline)"
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] resize-none"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors h-[60px]"
          >
            {sending ? '...' : 'Send'}
          </button>
        </form>
        {error && (
          <div className="mt-2 bg-[#f8514920] border border-[#f85149]/40 rounded-md px-3 py-2 text-sm text-[#ffa198]">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
