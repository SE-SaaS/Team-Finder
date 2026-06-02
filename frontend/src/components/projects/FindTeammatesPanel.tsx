'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeammateMatch {
  profile: {
    id: string
    name: string | null
    username: string | null
    avatar: string | null
    avatar_color: string | null
    university: string
    major: string | null
    year: number | null
    availability: string | null
  }
  score: {
    total: number
    base: number
    penaltyActive: boolean
    breakdown: {
      skill: number
      rating: number
      availability: number
    }
  }
  explanation: {
    matched: string[]
    missing: string[]
  }
}

interface Props {
  techStack: string[]
}

export default function FindTeammatesPanel({ techStack }: Props) {
  const router = useRouter()
  const [matches, setMatches] = useState<TeammateMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFind() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/teammates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: techStack }),
    })
    if (!res.ok) {
      setError('Failed to fetch matches')
      setLoading(false)
      return
    }
    const data = await res.json()
    setMatches(data.matches)
    setSearched(true)
    setLoading(false)
  }

  async function handleMessage(otherUserId: string) {
    await fetch('/api/chat/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ other_user_id: otherUserId }),
    })
    router.push('/chat')
  }

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Find Teammates</h3>
        <button
          onClick={handleFind}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Scoring...' : searched ? 'Refresh' : 'Run'}
        </button>
      </div>

      {!searched && !loading && (
        <p className="text-xs text-gray-400">
          Scores all students against this project's tech stack.
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {searched && !loading && matches.length === 0 && (
        <p className="text-xs text-gray-400">No matches found.</p>
      )}

      {matches.map(m => (
        <div key={m.profile.id}
             className="flex items-center justify-between rounded-lg border p-3 mb-2">

          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: m.profile.avatar_color ?? '#6b7280' }}
              className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              {m.profile.name?.[0] ?? '?'}
            </div>

            <div>
              <p className="text-sm font-medium">{m.profile.name ?? m.profile.username}</p>
              <p className="text-xs text-gray-400">
                {m.profile.university}{m.profile.year ? ` · Year ${m.profile.year}` : ''}{m.profile.major ? ` · ${m.profile.major}` : ''}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {m.explanation.matched.map(s => (
                  <span key={s} className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
                {m.explanation.missing.map(s => (
                  <span key={s} className="text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-sm font-bold">
                {m.score.total}<span className="text-xs text-gray-400">/100</span>
              </p>
              <p className="text-xs text-gray-400">
                Skill {m.score.breakdown.skill} · Trust {m.score.breakdown.rating} · Avail {m.score.breakdown.availability}
              </p>
              {m.score.penaltyActive && (
                <p className="text-xs text-amber-500">low trust penalty</p>
              )}
            </div>
            <button
              onClick={() => handleMessage(m.profile.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shrink-0">
              Message
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}
