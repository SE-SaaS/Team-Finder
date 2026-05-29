'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  author_id: string;
  author_name: string | null;
  vote_count: number;
  my_vote: boolean;
}

interface Answer {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  author_name: string | null;
  vote_count: number;
  my_vote: boolean;
}

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const questionId = params?.id;
  const { user } = useAuthenticatedUser();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!questionId) return;

    const { data: q, error: qErr } = await supabase
      .from('qna_questions')
      .select('id, title, body, tags, created_at, author_id')
      .eq('id', questionId)
      .maybeSingle();
    if (qErr || !q) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data: ansRows } = await supabase
      .from('qna_answers')
      .select('id, body, created_at, author_id')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    const answerIds = (ansRows ?? []).map((a) => a.id);
    const authorIds = Array.from(
      new Set([q.author_id, ...(ansRows ?? []).map((a) => a.author_id)])
    );

    const [profilesRes, qVotesRes, aVotesRes, myQVoteRes, myAVotesRes] = await Promise.all([
      supabase.from('profiles').select('id, name, username').in('id', authorIds),
      supabase.from('qna_question_votes').select('user_id').eq('question_id', questionId),
      answerIds.length
        ? supabase.from('qna_answer_votes').select('answer_id').in('answer_id', answerIds)
        : Promise.resolve({ data: [] as { answer_id: string }[] }),
      supabase
        .from('qna_question_votes')
        .select('user_id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle(),
      answerIds.length
        ? supabase
            .from('qna_answer_votes')
            .select('answer_id')
            .in('answer_id', answerIds)
            .eq('user_id', user.id)
        : Promise.resolve({ data: [] as { answer_id: string }[] }),
    ]);

    const nameById = new Map<string, string | null>();
    profilesRes.data?.forEach((p) =>
      nameById.set(p.id, p.name ?? p.username ?? null)
    );

    const aVoteCount = new Map<string, number>();
    aVotesRes.data?.forEach((v) =>
      aVoteCount.set(v.answer_id, (aVoteCount.get(v.answer_id) ?? 0) + 1)
    );

    const myAVoteSet = new Set((myAVotesRes.data ?? []).map((v) => v.answer_id));

    setQuestion({
      ...q,
      author_name: nameById.get(q.author_id) ?? null,
      vote_count: qVotesRes.data?.length ?? 0,
      my_vote: !!myQVoteRes.data,
    });

    setAnswers(
      (ansRows ?? []).map((a) => ({
        ...a,
        author_name: nameById.get(a.author_id) ?? null,
        vote_count: aVoteCount.get(a.id) ?? 0,
        my_vote: myAVoteSet.has(a.id),
      }))
    );

    setLoading(false);
  }, [questionId, user.id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function toggleQuestionVote() {
    if (!question) return;
    const previous = question;
    setQuestion({
      ...question,
      my_vote: !question.my_vote,
      vote_count: question.vote_count + (question.my_vote ? -1 : 1),
    });
    const res = await fetch(`/api/qna/questions/${question.id}/vote`, { method: 'POST' });
    if (!res.ok) setQuestion(previous);
  }

  async function toggleAnswerVote(answerId: string) {
    const previous = answers;
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId
          ? { ...a, my_vote: !a.my_vote, vote_count: a.vote_count + (a.my_vote ? -1 : 1) }
          : a
      )
    );
    const res = await fetch(`/api/qna/answers/${answerId}/vote`, { method: 'POST' });
    if (!res.ok) setAnswers(previous);
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!question) return;
    setError(null);
    setSubmitting(true);

    const res = await fetch(`/api/qna/questions/${question.id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: answerBody }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to post answer');
      setSubmitting(false);
      return;
    }

    setAnswerBody('');
    setSubmitting(false);
    await loadAll();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  if (notFound || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-center">
          <p className="text-[#f0f6fc] mb-4">Question not found.</p>
          <Link href="/qna" className="text-[#58a6ff] hover:underline text-sm">
            Back to Q&amp;A
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />

      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/qna"
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Q&amp;A</span>
          </Link>
          <h1 className="text-[#f0f6fc] font-semibold">Question</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        {/* Question */}
        <section className="border border-[#30363d] rounded-md bg-[#0d1117] p-5">
          <h2 className="text-[#f0f6fc] text-xl font-semibold mb-3">{question.title}</h2>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#8b949e] mb-4">
            <span>by <span className="text-[#c9d1d9]">{question.author_name ?? 'anonymous'}</span></span>
            <span>•</span>
            <span>{new Date(question.created_at).toLocaleString()}</span>
          </div>
          <p className="text-[#c9d1d9] text-sm whitespace-pre-wrap leading-relaxed">{question.body}</p>
          {question.tags.length > 0 && (
            <div className="mt-4 flex items-center flex-wrap gap-2">
              {question.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff]">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleQuestionVote}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition-colors ${
                question.my_vote
                  ? 'bg-[#238636]/20 border-[#238636] text-[#3fb950]'
                  : 'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#8b949e]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {question.vote_count}
            </button>
            <span className="text-[#6e7681] text-xs">
              {question.my_vote ? 'You upvoted this' : 'Click to upvote'}
            </span>
          </div>
        </section>

        {/* Answers */}
        <section>
          <h3 className="text-[#f0f6fc] font-semibold mb-3">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h3>
          {answers.length === 0 ? (
            <p className="text-[#8b949e] text-sm border border-dashed border-[#30363d] rounded-md px-4 py-6 text-center">
              No answers yet. Be the first to help.
            </p>
          ) : (
            <ul className="space-y-3">
              {answers.map((a) => (
                <li key={a.id} className="border border-[#30363d] rounded-md bg-[#0d1117] p-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAnswerVote(a.id)}
                      className={`shrink-0 flex flex-col items-center gap-0.5 text-xs px-2 py-1.5 rounded-md border transition-colors ${
                        a.my_vote
                          ? 'bg-[#238636]/20 border-[#238636] text-[#3fb950]'
                          : 'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#8b949e]'
                      }`}
                      title={a.my_vote ? 'Remove upvote' : 'Upvote'}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>{a.vote_count}</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#c9d1d9] text-sm whitespace-pre-wrap leading-relaxed">{a.body}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#8b949e]">
                        <span>by <span className="text-[#c9d1d9]">{a.author_name ?? 'anonymous'}</span></span>
                        <span>•</span>
                        <span>{new Date(a.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Post answer */}
        <section className="border border-[#30363d] rounded-md bg-[#0d1117] p-5">
          <h3 className="text-[#f0f6fc] font-semibold mb-3">Your answer</h3>
          <form onSubmit={handleSubmitAnswer} className="space-y-3">
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              maxLength={10000}
              required
              rows={6}
              placeholder="Share what you know..."
              className="w-full bg-[#010409] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] resize-y"
            />
            <p className="text-[11px] text-[#6e7681]">5–10000 characters ({answerBody.length}/10000)</p>
            {error && (
              <div className="bg-[#f8514920] border border-[#f85149]/40 rounded-md px-3 py-2 text-sm text-[#ffa198]">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              {submitting ? 'Posting...' : 'Post answer'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
