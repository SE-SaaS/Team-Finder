'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

export default function AskQuestionPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    const res = await fetch('/api/qna/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, tags }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to post question');
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    router.push(`/qna/${data.id}`);
  }

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />

      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/qna"
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Q&amp;A</span>
          </Link>
          <h1 className="text-[#f0f6fc] font-semibold">Ask a question</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#c9d1d9] text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              placeholder="What's your question? Be specific."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
            />
            <p className="text-[11px] text-[#6e7681] mt-1">5–200 characters ({title.length}/200)</p>
          </div>

          <div>
            <label className="block text-[#c9d1d9] text-sm font-medium mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={10000}
              required
              rows={10}
              placeholder="Provide context, what you've tried, and what you expect..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] resize-y"
            />
            <p className="text-[11px] text-[#6e7681] mt-1">10–10000 characters ({body.length}/10000)</p>
          </div>

          <div>
            <label className="block text-[#c9d1d9] text-sm font-medium mb-1">
              Tags <span className="text-[#6e7681] font-normal">(optional, comma-separated, up to 5)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, supabase, algorithms"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          {error && (
            <div className="bg-[#f8514920] border border-[#f85149]/40 rounded-md px-3 py-2 text-sm text-[#ffa198]">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              {submitting ? 'Posting...' : 'Post question'}
            </button>
            <Link href="/qna" className="text-[#8b949e] hover:text-[#f0f6fc] text-sm transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
