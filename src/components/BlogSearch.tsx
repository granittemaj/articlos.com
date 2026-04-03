'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'

export default function BlogSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (value.trim()) params.set('q', value.trim())
      router.push(`/blog${params.toString() ? '?' + params.toString() : ''}`)
    }, 350)
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto 0', position: 'relative' }}>
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="#a0a09c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search articles…"
        style={{
          width: '100%',
          padding: '10px 14px 10px 38px',
          borderRadius: 8,
          border: '1px solid #e8e8e6',
          background: '#ffffff',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'Geist, sans-serif',
          color: '#0f0f0e',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#c8c8c4' }}
        onBlur={(e) => { e.target.style.borderColor = '#e8e8e6' }}
      />
    </div>
  )
}
