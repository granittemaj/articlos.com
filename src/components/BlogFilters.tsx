'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface BlogFiltersProps {
  allTags: string[]
  currentTag?: string
  currentQ?: string
}

export default function BlogFilters({ allTags, currentTag, currentQ }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentQ || '')

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.delete('page')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ q: search.trim() || undefined })
  }

  function toggleTag(tag: string) {
    updateParams({ tag: currentTag === tag ? undefined : tag })
  }

  const hasFilters = !!currentTag || !!currentQ

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: allTags.length > 0 ? 20 : 0,
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a0a09c"
            strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: '1px solid #e8e8e6',
              borderRadius: 8,
              fontSize: 14,
              background: '#ffffff',
              color: '#0f0f0e',
              outline: 'none',
              fontFamily: 'Geist, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '9px 18px',
            borderRadius: 8,
            border: '1px solid #e8e8e6',
            background: '#0f0f0e',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Geist, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch('')
              updateParams({ q: undefined, tag: undefined })
            }}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              border: '1px solid #e8e8e6',
              background: '#ffffff',
              color: '#6b6b67',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'Geist, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => updateParams({ tag: undefined })}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: !currentTag ? '#0f0f0e' : '#e8e8e6',
              background: !currentTag ? '#0f0f0e' : '#ffffff',
              color: !currentTag ? '#ffffff' : '#6b6b67',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Geist, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: currentTag === tag ? '#0f0f0e' : '#e8e8e6',
                background: currentTag === tag ? '#0f0f0e' : '#ffffff',
                color: currentTag === tag ? '#ffffff' : '#6b6b67',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Geist, sans-serif',
                transition: 'all 0.15s ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
