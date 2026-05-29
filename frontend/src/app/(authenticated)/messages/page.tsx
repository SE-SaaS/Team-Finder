'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatar_color: string | null;
  major: string | null;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  edited_at: string | null;
  is_edited: boolean;
  is_deleted: boolean;
}

interface Conversation {
  id: string;
  updated_at: string;
  is_archived: boolean;
  other_user: Profile;
  last_message: Message | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function displayName(profile: Profile) {
  return profile.name ?? profile.email.split('@')[0];
}

function initials(label: string) {
  return label
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function Avatar({ profile, size = 'md' }: { profile: Profile; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: profile.avatar_color ?? '#dc2626' }}
    >
      {initials(displayName(profile))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { user } = useAuthenticatedUser();

  const [tab, setTab]                   = useState<'inbox' | 'archive'>('inbox');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv]     = useState<Conversation | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState('');
  const [sending, setSending]           = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);

  // Edit state
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // New-chat modal
  const [showNewChat, setShowNewChat]   = useState(false);
  const [userSearch, setUserSearch]     = useState('');
  const [foundUsers, setFoundUsers]     = useState<Profile[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [chatError, setChatError]       = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const realtimRef     = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Load conversations ─────────────────────────────────────────────────

  const loadConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      // 1. My participations
      const { data: myParts, error: e1 } = await supabase
        .from('conversation_participants')
        .select('conversation_id, is_archived')
        .eq('user_id', user.id);
      if (e1) throw e1;
      if (!myParts?.length) { setConversations([]); return; }

      const convIds = myParts.map(p => p.conversation_id);
      const archivedMap: Record<string, boolean> = {};
      myParts.forEach(p => { archivedMap[p.conversation_id] = p.is_archived; });

      // 2. All participants (to find the other user)
      const { data: allParts, error: e2 } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', convIds)
        .neq('user_id', user.id);
      if (e2) throw e2;

      const otherUserIds = [...new Set((allParts ?? []).map(p => p.user_id))];

      // 3. Other users' profiles
      const { data: profiles, error: e3 } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_color, major')
        .in('id', otherUserIds);
      if (e3) throw e3;

      const profileMap: Record<string, Profile> = {};
      (profiles ?? []).forEach(p => { profileMap[p.id] = p; });

      const otherUserByConv: Record<string, string> = {};
      (allParts ?? []).forEach(p => { otherUserByConv[p.conversation_id] = p.user_id; });

      // 4. Conversations (for updated_at ordering)
      const { data: convData, error: e4 } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .in('id', convIds)
        .order('updated_at', { ascending: false });
      if (e4) throw e4;

      // 5. Latest message per conversation
      const { data: allMsgs, error: e5 } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, created_at, is_edited, is_deleted')
        .in('conversation_id', convIds)
        .order('created_at', { ascending: false });
      if (e5) throw e5;

      const lastMsgByConv: Record<string, Message> = {};
      (allMsgs ?? []).forEach(m => {
        if (!lastMsgByConv[m.conversation_id] && !m.is_deleted) {
          lastMsgByConv[m.conversation_id] = m as Message;
        }
      });

      // 6. Assemble
      const built: Conversation[] = (convData ?? [])
        .map(c => {
          const otherId = otherUserByConv[c.id];
          const other   = otherId ? profileMap[otherId] : null;
          if (!other) return null;
          return {
            id:          c.id,
            updated_at:  c.updated_at,
            is_archived: archivedMap[c.id] ?? false,
            other_user:  other,
            last_message: lastMsgByConv[c.id] ?? null,
          } satisfies Conversation;
        })
        .filter(Boolean) as Conversation[];

      setConversations(built);
    } finally {
      setLoadingConvs(false);
    }
  }, [user.id]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // ── Load messages for active conversation ─────────────────────────────

  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (!error) setMessages((data ?? []) as Message[]);
    setLoadingMsgs(false);
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv.id);

    // Real-time subscription for this conversation
    if (realtimRef.current) supabase.removeChannel(realtimRef.current);

    const channel = supabase
      .channel(`messages:${activeConv.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConv.id}` },
        payload => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
            loadConversations(); // refresh last message in list
          }
          if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as Message : m));
          }
        }
      )
      .subscribe();

    realtimRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [activeConv?.id, loadMessages, loadConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────

  const sendMessage = async () => {
    if (!activeConv || !input.trim() || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);
    await supabase.from('messages').insert({
      conversation_id: activeConv.id,
      sender_id:       user.id,
      content,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Edit message ─────────────────────────────────────────────────────

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = async () => {
    if (!editingId || !editContent.trim()) return;
    await supabase
      .from('messages')
      .update({ content: editContent.trim(), is_edited: true, edited_at: new Date().toISOString() })
      .eq('id', editingId);
    setEditingId(null);
    setEditContent('');
  };

  const cancelEdit = () => { setEditingId(null); setEditContent(''); };

  // ── Ignore / Unignore ─────────────────────────────────────────────────

  const ignoreUser = async (conv: Conversation) => {
    await supabase.from('ignored_users').insert({ ignorer_id: user.id, ignored_id: conv.other_user.id });
    await supabase
      .from('conversation_participants')
      .update({ is_archived: true })
      .eq('conversation_id', conv.id)
      .eq('user_id', user.id);
    setActiveConv(null);
    loadConversations();
  };

  const unignoreUser = async (conv: Conversation) => {
    await supabase
      .from('ignored_users')
      .delete()
      .eq('ignorer_id', user.id)
      .eq('ignored_id', conv.other_user.id);
    await supabase
      .from('conversation_participants')
      .update({ is_archived: false })
      .eq('conversation_id', conv.id)
      .eq('user_id', user.id);
    setActiveConv({ ...conv, is_archived: false });
    loadConversations();
  };

  // ── User search for new chat ──────────────────────────────────────────

  useEffect(() => {
    if (!userSearch.trim()) { setFoundUsers([]); return; }
    const q = userSearch.trim();
    const t = setTimeout(async () => {
      setSearchingUsers(true);
      // Search by name OR email so users without a name still appear
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_color, major')
        .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
        .neq('id', user.id)
        .limit(8);
      setFoundUsers((data ?? []) as Profile[]);
      setSearchingUsers(false);
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch, user.id]);

  const openOrCreateConversation = async (otherUser: Profile) => {
    setChatError(null);

    // Check if conversation already exists
    const existing = conversations.find(c => c.other_user.id === otherUser.id);
    if (existing) {
      setShowNewChat(false);
      setUserSearch('');
      setFoundUsers([]);
      setTab(existing.is_archived ? 'archive' : 'inbox');
      setActiveConv(existing);
      return;
    }

    // Create the conversation row
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .insert({})
      .select('id, updated_at')
      .single();
    if (convErr || !conv) {
      setChatError('Could not create conversation. Make sure the database migration has been applied.');
      return;
    }

    // Insert participants sequentially so the second insert's RLS EXISTS check
    // can see the first row already committed.
    const { error: p1Err } = await supabase
      .from('conversation_participants')
      .insert({ conversation_id: conv.id, user_id: user.id });
    if (p1Err) { setChatError(`Failed to add participants: ${p1Err.message}`); return; }

    const { error: p2Err } = await supabase
      .from('conversation_participants')
      .insert({ conversation_id: conv.id, user_id: otherUser.id });
    if (p2Err) { setChatError(`Failed to add participants: ${p2Err.message}`); return; }

    const newConv: Conversation = {
      id:           conv.id,
      updated_at:   conv.updated_at,
      is_archived:  false,
      other_user:   otherUser,
      last_message: null,
    };
    setConversations(prev => [newConv, ...prev]);
    setTab('inbox');
    setActiveConv(newConv);
    setShowNewChat(false);
    setUserSearch('');
    setFoundUsers([]);
  };

  // ── Derived lists ─────────────────────────────────────────────────────

  const visibleConvs = conversations.filter(c =>
    tab === 'inbox' ? !c.is_archived : c.is_archived
  );

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden">

      {/* ── Left: conversation list ───────────────────────────────────── */}
      <aside className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#21262d] shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-[#f0f6fc] font-semibold text-base">Messages</h1>
          </div>
          <button
            onClick={() => setShowNewChat(true)}
            className="flex items-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#21262d]">
          {(['inbox', 'archive'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setActiveConv(null); }}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? 'text-[#f0f6fc] border-b-2 border-[#dc2626]'
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              {t === 'archive' ? '📁 Archive' : '💬 Inbox'}
              {t === 'archive' && conversations.filter(c => c.is_archived).length > 0 && (
                <span className="ml-1.5 bg-[#30363d] text-[#8b949e] rounded-full px-1.5 py-0.5 text-[10px]">
                  {conversations.filter(c => c.is_archived).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-12 text-[#8b949e] text-sm">Loading…</div>
          ) : visibleConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-[#8b949e] text-sm">
                {tab === 'inbox' ? 'No conversations yet' : 'No archived conversations'}
              </p>
              {tab === 'inbox' && (
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-3 text-[#dc2626] text-xs hover:underline"
                >
                  Start a new chat
                </button>
              )}
            </div>
          ) : (
            visibleConvs.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-[#21262d] hover:bg-[#161b22] transition-colors text-left ${
                  activeConv?.id === conv.id ? 'bg-[#161b22]' : ''
                }`}
              >
                <Avatar profile={conv.other_user} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#f0f6fc] text-sm font-medium truncate">{displayName(conv.other_user)}</span>
                    {conv.last_message && (
                      <span className="text-[#8b949e] text-[10px] shrink-0 ml-2">
                        {timeAgo(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-[#8b949e] text-xs truncate">
                    {conv.last_message
                      ? (conv.last_message.is_deleted
                          ? 'Message deleted'
                          : `${conv.last_message.sender_id === user.id ? 'You: ' : ''}${conv.last_message.content}`)
                      : 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Right: chat thread ─────────────────────────────────────────── */}
      {activeConv ? (
        <main className="flex-1 flex flex-col min-w-0">

          {/* Thread header */}
          <div className="px-4 py-3 border-b border-[#21262d] bg-[#161b22] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConv(null)}
                className="md:hidden text-[#8b949e] hover:text-[#f0f6fc] transition-colors mr-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Avatar profile={activeConv.other_user} size="sm" />
              <div>
                <p className="text-[#f0f6fc] text-sm font-semibold">{displayName(activeConv.other_user)}</p>
                {activeConv.other_user.major && (
                  <p className="text-[#8b949e] text-[11px]">{activeConv.other_user.major}</p>
                )}
              </div>
            </div>

            {/* Ignore / Unignore */}
            {activeConv.is_archived ? (
              <button
                onClick={() => unignoreUser(activeConv)}
                className="flex items-center gap-1.5 text-xs text-[#3fb950] border border-[#238636]/50 bg-[#238636]/10 hover:bg-[#238636]/20 rounded-md px-3 py-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unignore
              </button>
            ) : (
              <button
                onClick={() => ignoreUser(activeConv)}
                className="flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#f85149] border border-[#30363d] hover:border-[#f85149]/40 hover:bg-[#f85149]/10 rounded-md px-3 py-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Ignore
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {loadingMsgs ? (
              <div className="flex items-center justify-center py-12 text-[#8b949e] text-sm">Loading…</div>
            ) : messages.filter(m => !m.is_deleted).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Avatar profile={activeConv.other_user} size="lg" />
                <p className="text-[#f0f6fc] text-sm font-medium mt-3">{displayName(activeConv.other_user)}</p>
                <p className="text-[#8b949e] text-xs mt-1">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map(msg => {
                if (msg.is_deleted) return null;
                const isOwn = msg.sender_id === user.id;

                if (editingId === msg.id) {
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[75%] w-full">
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          rows={2}
                          className="w-full bg-[#0d1117] border border-[#58a6ff] rounded-xl px-3 py-2 text-sm text-[#c9d1d9] focus:outline-none resize-none"
                        />
                        <div className="flex gap-2 mt-1 justify-end">
                          <button onClick={cancelEdit} className="text-[10px] text-[#8b949e] hover:text-[#f0f6fc]">Cancel</button>
                          <button onClick={saveEdit}   className="text-[10px] text-[#58a6ff] hover:underline">Save</button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                    <div className="max-w-[75%]">
                      <div className="relative">
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            isOwn
                              ? 'bg-[#dc2626] text-white rounded-br-sm'
                              : 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-bl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Edit button (own messages only) */}
                        {isOwn && (
                          <button
                            onClick={() => startEdit(msg)}
                            className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#8b949e] hover:text-[#f0f6fc] p-1"
                            title="Edit message"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Timestamp + edited */}
                      <div className={`flex gap-1.5 mt-0.5 text-[10px] text-[#8b949e] ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span>{timeAgo(msg.created_at)}</span>
                        {msg.is_edited && <span>· edited</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Archived notice */}
          {activeConv.is_archived && (
            <div className="px-4 py-2 bg-[#161b22] border-t border-[#21262d] text-xs text-[#8b949e] text-center">
              This conversation is in your archive. You&apos;ve ignored this user.
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#21262d] bg-[#161b22]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={`Message ${displayName(activeConv.other_user)}…`}
                disabled={sending}
                rows={1}
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-2xl px-4 py-2.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '40px', maxHeight: '120px' }}
                onInput={e => {
                  const t = e.currentTarget;
                  t.style.height = 'auto';
                  t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0"
              >
                <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-[#8b949e] mt-1.5 ml-1">Enter to send · Shift+Enter for new line</p>
          </div>
        </main>
      ) : (
        /* Empty state when no conversation is selected */
        <main className="flex-1 hidden md:flex flex-col items-center justify-center text-center px-8">
          <div className="w-16 h-16 rounded-full bg-[#21262d] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-[#f0f6fc] font-semibold text-base mb-1">Your messages</h2>
          <p className="text-[#8b949e] text-sm mb-4">Select a conversation or start a new one</p>
          <button
            onClick={() => setShowNewChat(true)}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            New Chat
          </button>
        </main>
      )}

      {/* ── New Chat Modal ─────────────────────────────────────────────── */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#21262d]">
              <h2 className="text-[#f0f6fc] font-semibold text-sm">New Message</h2>
              <button
                onClick={() => { setShowNewChat(false); setUserSearch(''); setFoundUsers([]); setChatError(null); }}
                className="text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {chatError && (
                <div className="mb-3 rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-xs text-[#f85149]">
                  {chatError}
                </div>
              )}
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  autoFocus
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search students by name…"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="min-h-[120px]">
                {searchingUsers && (
                  <div className="flex items-center justify-center py-8 text-[#8b949e] text-sm">Searching…</div>
                )}
                {!searchingUsers && userSearch && foundUsers.length === 0 && (
                  <div className="flex items-center justify-center py-8 text-[#8b949e] text-sm">No students found</div>
                )}
                {!searchingUsers && !userSearch && (
                  <div className="flex items-center justify-center py-8 text-[#8b949e] text-xs">Type a name to find a student</div>
                )}
                <div className="space-y-1">
                  {foundUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => openOrCreateConversation(u)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#21262d] transition-colors text-left"
                    >
                      <Avatar profile={u} size="sm" />
                      <div className="min-w-0">
                        <p className="text-[#f0f6fc] text-sm font-medium truncate">{displayName(u)}</p>
                        {u.major && <p className="text-[#8b949e] text-xs truncate">{u.major}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
