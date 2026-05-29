'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

interface QuestionRow {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  author_id: string;
  author_name: string | null;
  answer_count: number;
  vote_count: number;
}

export default function QnaListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchQuestions() {
      const { data: rows, error } = await supabase
        .from('qna_questions')
        .select('id, title, body, tags, created_at, author_id')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !rows) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));
      const qIds = rows.map((r) => r.id);

      const [profilesRes, answersRes, votesRes] = await Promise.all([
        supabase.from('profiles').select('id, name, username').in('id', authorIds),
        supabase.from('qna_answers').select('question_id').in('question_id', qIds),
        supabase.from('qna_question_votes').select('question_id').in('question_id', qIds),
      ]);

      const nameById = new Map<string, string | null>();
      profilesRes.data?.forEach((p) =>
        nameById.set(p.id, p.name ?? p.username ?? null)
      );

      const answerCountById = new Map<string, number>();
      answersRes.data?.forEach((a) =>
        answerCountById.set(a.question_id, (answerCountById.get(a.question_id) ?? 0) + 1)
      );

      const voteCountById = new Map<string, number>();
      votesRes.data?.forEach((v) =>
        voteCountById.set(v.question_id, (voteCountById.get(v.question_id) ?? 0) + 1)
      );

      setQuestions(
        rows.map((r) => ({
          ...r,
          author_name: nameById.get(r.author_id) ?? null,
          answer_count: answerCountById.get(r.id) ?? 0,
          vote_count: voteCountById.get(r.id) ?? 0,
        }))
      );
      setLoading(false);
    }

    fetchQuestions();
  }, [user]);

  const filtered = search.trim()
    ? questions.filter((q) => {
        const needle = search.toLowerCase();
        return (
          q.title.toLowerCase().includes(needle) ||
          q.body.toLowerCase().includes(needle) ||
          q.tags.some((t) => t.toLowerCase().includes(needle))
        );
      })
    : questions;

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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">Dashboard</span>
          </Link>
          <h1 className="text-[#f0f6fc] font-semibold">Q&A</h1>
          <Link
            href="/qna/new"
            className="bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-3 py-1.5 rounded-md transition-colors"
          >
            Ask a question
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions by title, body, or tag..."
          className="w-full mb-6 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
        />

        {loading ? (
          <p className="text-[#8b949e] text-sm">Loading questions...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#30363d] rounded-md">
            <p className="text-[#8b949e] text-sm mb-4">
              {questions.length === 0 ? 'No questions yet.' : 'No questions match your search.'}
            </p>
            {questions.length === 0 && (
              <Link
                href="/qna/new"
                className="inline-block bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
              >
                Ask the first question
              </Link>
            )}
          </div>
        ) : (
          <ul className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
            {filtered.map((q) => (
              <li
                key={q.id}
                className="px-4 py-4 border-b border-[#21262d] last:border-0 hover:bg-[#161b22] transition-colors"
              >
                <Link href={`/qna/${q.id}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[#58a6ff] font-semibold text-sm mb-1 hover:underline truncate">
                        {q.title}
                      </h2>
                      <p className="text-[#8b949e] text-xs line-clamp-2 leading-relaxed">
                        {q.body}
                      </p>
                      <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#8b949e]">
                        <span>
                          by{' '}
                          <span className="text-[#c9d1d9]">
                            {q.author_name ?? 'anonymous'}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        {q.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1.5 flex-wrap">
                              {q.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff]"
                                >
                                  {t}
                                </span>
                              ))}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-[#8b949e] shrink-0">
                      <span>
                        <span className="text-[#f0f6fc] font-semibold">
                          {q.vote_count}
                        </span>{' '}
                        votes
                      </span>
                      <span>
                        <span className="text-[#f0f6fc] font-semibold">
                          {q.answer_count}
                        </span>{' '}
                        answers
                      </span>
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
