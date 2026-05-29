'use client';

import { useState } from 'react';
import Link from 'next/link';

type VoteState = 'up' | 'down' | null;

interface FAQItem {
  q: string;
  a: string;
  askedBy: string;
  baseVotes: number;
  answeredBy: string;
  timeAgo: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Who can join TeamFinder?',
    a: 'TeamFinder is open to students at the University of Jordan and Hashemite University. You must sign up with your official university email (@ju.edu.jo or @hu.edu.jo). No exceptions — the domain is validated at signup.',
    askedBy: 'u/new_student_2025',
    baseVotes: 847,
    answeredBy: 'u/TeamFinder_Official',
    timeAgo: '3 months ago',
  },
  {
    q: 'How does the team-matching algorithm work?',
    a: 'The engine computes a 0–100 score per candidate using cosine skill similarity, a normalized skill rating, and an availability score. Profiles with low ratings get a penalty multiplier. Top matches appear on your dashboard automatically.',
    askedBy: 'u/cs_junior_ju',
    baseVotes: 612,
    answeredBy: 'u/dev_team',
    timeAgo: '2 months ago',
  },
  {
    q: 'What types of projects can I find?',
    a: 'Two kinds: university-created projects posted by faculty or clubs, and external projects pulled from GitHub, Kaggle, HuggingFace, CTFtime, and 10+ other open platforms. Both show up in the project browser with filters.',
    askedBy: 'u/hackathon_seeker',
    baseVotes: 503,
    answeredBy: 'u/TeamFinder_Official',
    timeAgo: '2 months ago',
  },
  {
    q: 'How are my skills verified?',
    a: 'You add skills from the catalog manually or complete courses that auto-unlock related skills. Each skill has a proficiency level and rating. Skill exam results are stored in your profile and factored into your match score.',
    askedBy: 'u/profile_builder_99',
    baseVotes: 389,
    answeredBy: 'u/algo_team',
    timeAgo: '6 weeks ago',
  },
  {
    q: 'Can I change my university after signing up?',
    a: 'No. The university field is immutable — it is set at signup from your email domain and locked at the database level. This is intentional to prevent misrepresentation.',
    askedBy: 'u/transfer_student_hu',
    baseVotes: 271,
    answeredBy: 'u/TeamFinder_Official',
    timeAgo: '5 weeks ago',
  },
  {
    q: 'What can the AI assistant actually do?',
    a: 'The AI chat can search courses, find teammates, browse projects, show your learning progress, and add/remove courses and skills from your profile — all in plain language. It cannot modify anything outside your own profile.',
    askedBy: 'u/ai_curious_ds',
    baseVotes: 198,
    answeredBy: 'u/backend_crew',
    timeAgo: '3 weeks ago',
  },
  {
    q: 'Is TeamFinder free?',
    a: 'Yes, completely free for enrolled students at the University of Jordan and Hashemite University. There are no paid tiers.',
    askedBy: 'u/budget_student_lol',
    baseVotes: 1204,
    answeredBy: 'u/TeamFinder_Official',
    timeAgo: '4 months ago',
  },
  {
    q: 'What happens after I match with a teammate?',
    a: 'You send a join request to a project or invite a matched student to collaborate. Once accepted, you appear as a project member. Coordination happens through the platform.',
    askedBy: 'u/ready_to_collab',
    baseVotes: 156,
    answeredBy: 'u/product_team',
    timeAgo: '2 weeks ago',
  },
];

function VoteWidget({ baseVotes }: { baseVotes: number }) {
  const [vote, setVote] = useState<VoteState>(null);

  const count =
    vote === 'up' ? baseVotes + 1 : vote === 'down' ? baseVotes - 1 : baseVotes;

  const toggle = (dir: 'up' | 'down') =>
    setVote(prev => (prev === dir ? null : dir));

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <button
        onClick={() => toggle('up')}
        className={`rounded transition-colors hover:bg-white/10 p-1 ${
          vote === 'up' ? 'text-orange-400' : 'text-muted hover:text-faint'
        }`}
        aria-label="Upvote"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 8H4z" />
        </svg>
      </button>
      <span
        className={`text-[11px] font-bold tabular-nums ${
          vote === 'up'
            ? 'text-orange-400'
            : vote === 'down'
            ? 'text-blue-400'
            : 'text-faint'
        }`}
      >
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </span>
      <button
        onClick={() => toggle('down')}
        className={`rounded transition-colors hover:bg-white/10 p-1 ${
          vote === 'down' ? 'text-blue-400' : 'text-muted hover:text-faint'
        }`}
        aria-label="Downvote"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-8-8h16z" />
        </svg>
      </button>
    </div>
  );
}

function PostCard({ item }: { item: FAQItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex gap-3 rounded border border-line bg-surface p-3 transition-colors hover:border-white/20">
      {/* Vote column */}
      <VoteWidget baseVotes={item.baseVotes} />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] text-muted">
          <span className="font-medium text-dim">r/TeamFinder</span>
          {' · Posted by '}
          <span className="hover:underline cursor-pointer">{item.askedBy}</span>
          {' · '}
          {item.timeAgo}
        </p>

        <h2 className="mb-2 text-[15px] font-medium leading-snug text-faint">
          {item.q}
        </h2>

        {/* Flair */}
        <span className="mb-3 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
          FAQ
        </span>

        {/* Top comment / answer */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-1 flex w-full items-center gap-1.5 text-[11px] text-dim hover:text-faint transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {expanded ? 'Hide top answer' : 'View top answer'}
        </button>

        {expanded && (
          <div className="mt-3 border-l-2 border-orange-400/50 pl-3">
            <p className="mb-1 text-[10px] font-medium text-orange-400">
              {item.answeredBy}{' '}
              <span className="ml-1 rounded bg-orange-400/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
                Official
              </span>
            </p>
            <p className="text-[13px] font-light leading-relaxed text-dim">
              {item.a}
            </p>
          </div>
        )}

        {/* Post actions */}
        <div className="mt-3 flex gap-4">
          <button className="flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-faint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            1 Answer
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-faint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Share
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-faint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [sort, setSort] = useState<'hot' | 'top' | 'new'>('hot');

  const sorted = [...FAQS].sort((a, b) => {
    if (sort === 'top') return b.baseVotes - a.baseVotes;
    if (sort === 'new') return FAQS.indexOf(b) - FAQS.indexOf(a);
    return b.baseVotes * 0.8 - a.baseVotes * 0.8;
  });

  return (
    <div className="font-body min-h-screen bg-ink text-faint">
      {/* Noise overlay */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-[999] opacity-[0.028]" />

      {/* Reddit-style header */}
      <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="font-display flex h-[32px] w-[32px] items-center justify-center rounded-full bg-accent text-[14px] font-extrabold text-white">
              T
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">r/TeamFinder</p>
              <p className="text-[10px] text-muted leading-tight">FAQ &amp; Help Center</p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="font-display rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-dim"
          >
            Join Now
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 lg:flex lg:gap-6">
        {/* Main feed */}
        <main className="min-w-0 flex-1">
          {/* Subreddit banner */}
          <div className="mb-4 overflow-hidden rounded border border-line bg-surface">
            <div className="h-16 bg-gradient-to-r from-accent/40 to-accent/10" />
            <div className="flex items-end gap-3 px-4 pb-3 -mt-5">
              <div className="h-14 w-14 rounded-full border-4 border-surface bg-accent flex items-center justify-center text-2xl font-extrabold text-white font-display flex-shrink-0">
                T
              </div>
              <div className="mb-1">
                <p className="font-bold text-white text-sm">r/TeamFinder</p>
                <p className="text-[11px] text-muted">Frequently Asked Questions</p>
              </div>
            </div>
            <div className="border-t border-line px-4 py-2 flex gap-6 text-[11px] text-muted">
              <span><strong className="text-faint">4.2k</strong> members</span>
              <span><strong className="text-green-400">38</strong> online</span>
              <span>Created 2024</span>
            </div>
          </div>

          {/* Sort bar */}
          <div className="mb-3 flex items-center gap-1 rounded border border-line bg-surface p-2">
            {(['hot', 'top', 'new'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                  sort === s
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted hover:bg-white/5 hover:text-faint'
                }`}
              >
                {s === 'hot' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z" />
                  </svg>
                )}
                {s === 'top' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V4M5 11l7-7 7 7" />
                  </svg>
                )}
                {s === 'new' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                )}
                {s}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-2">
            {sorted.map((item, i) => (
              <PostCard key={i} item={item} />
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-3">
          {/* About widget */}
          <div className="rounded border border-line bg-surface p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-dim">
              About Community
            </p>
            <p className="mb-4 text-[13px] font-light leading-relaxed text-dim">
              The official FAQ for TeamFinder — the university team-matching platform for students at UJ and HU.
            </p>
            <div className="mb-4 flex gap-6 text-center">
              <div>
                <p className="text-lg font-bold text-white">4.2k</p>
                <p className="text-[10px] text-muted">Members</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-400">38</p>
                <p className="text-[10px] text-muted">Online</p>
              </div>
            </div>
            <div className="border-t border-line pt-4 space-y-2">
              <Link
                href="/auth/signup"
                className="font-display block w-full rounded-sm bg-accent py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-dim"
              >
                Join TeamFinder
              </Link>
              <Link
                href="/auth/login"
                className="block w-full rounded-sm border border-line py-2 text-center text-xs font-medium text-dim transition-colors hover:border-white/30 hover:text-faint"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Rules widget */}
          <div className="rounded border border-line bg-surface p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-dim">
              Rules
            </p>
            <ol className="space-y-2 text-[12px] text-dim">
              {[
                'University students only',
                'Use your real university email',
                'One account per student',
                'No spam or self-promotion',
              ].map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-bold text-accent flex-shrink-0">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ol>
          </div>

          {/* Supported unis */}
          <div className="rounded border border-line bg-surface p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-dim">
              Supported Universities
            </p>
            <div className="space-y-2 text-[12px] text-dim">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                University of Jordan (@ju.edu.jo)
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                Hashemite University (@hu.edu.jo)
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
