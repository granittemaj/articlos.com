'use client'

import { useEffect, useState } from 'react'

const CONTENT_FIELDS = [
  {
    key: 'hero_badge',
    label: 'Hero Badge Text',
    description: 'The pill text above the hero headline (e.g., "Now with GPT-4o")',
    rows: 1,
  },
  {
    key: 'hero_title',
    label: 'Hero Title',
    description: 'Main headline on the homepage. Use \\n for line breaks.',
    rows: 2,
  },
  {
    key: 'hero_subtitle',
    label: 'Hero Subtitle',
    description: 'Subheading below the main headline.',
    rows: 3,
  },
  {
    key: 'features_title',
    label: 'Features Section Title',
    description: 'Headline above the features grid.',
    rows: 1,
  },
  {
    key: 'features_subtitle',
    label: 'Features Section Subtitle',
    description: 'Subheading below the features title.',
    rows: 2,
  },
  {
    key: 'cta_title',
    label: 'CTA Banner Title',
    description: 'Headline for the dark CTA section.',
    rows: 1,
  },
  {
    key: 'cta_subtitle',
    label: 'CTA Banner Subtitle',
    description: 'Supporting text below the CTA headline.',
    rows: 2,
  },
  {
    key: 'newsletter_title',
    label: 'Newsletter Section Title',
    description: 'Headline above the newsletter signup form.',
    rows: 1,
  },
  {
    key: 'newsletter_subtitle',
    label: 'Newsletter Section Subtitle',
    description: 'Supporting text below the newsletter headline.',
    rows: 2,
  },
  {
    key: 'social_proof_label',
    label: 'Social Proof Label',
    description: 'The small label above the logos carousel.',
    rows: 1,
  },
]

const DEFAULTS: Record<string, string> = {
  hero_badge: 'Now with GPT-4o, Claude & Gemini 2.5',
  hero_title: 'AI articles that rank,\nautomatically.',
  hero_subtitle:
    'articlos generates SEO-optimised articles, manages your content calendar, and publishes to WordPress — all on autopilot.',
  features_title: 'Everything you need to dominate search',
  features_subtitle:
    'From keyword research to auto-publishing, articlos handles the full content pipeline.',
  cta_title: 'Start generating content today',
  cta_subtitle:
    'Give articlos your Search Console and it will do the rest — discover, plan, generate, publish, measure, improve.',
  newsletter_title: 'Stay ahead of the content curve',
  newsletter_subtitle:
    'Weekly insights on SEO, AI content, and what\'s actually working in content marketing — straight to your inbox. No fluff.',
  social_proof_label: '',
}

interface FieldState {
  value: string
  saving: boolean
  saved: boolean
  error: string
}

export default function ContentEditorPage() {
  const [fields, setFields] = useState<Record<string, FieldState>>(() => {
    const init: Record<string, FieldState> = {}
    CONTENT_FIELDS.forEach((f) => {
      init[f.key] = {
        value: DEFAULTS[f.key] || '',
        saving: false,
        saved: false,
        error: '',
      }
    })
    return init
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/admin/content')
        const data = await res.json()
        if (data.content) {
          setFields((prev) => {
            const next = { ...prev }
            Object.entries(data.content as Record<string, string>).forEach(
              ([key, value]) => {
                if (next[key]) {
                  next[key] = { ...next[key], value }
                }
              }
            )
            return next
          })
        }
      } catch {
        // Keep defaults
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  async function handleSave(key: string) {
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], saving: true, error: '', saved: false },
    }))

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: fields[key].value }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }

      setFields((prev) => ({
        ...prev,
        [key]: { ...prev[key], saving: false, saved: true },
      }))

      setTimeout(() => {
        setFields((prev) => ({
          ...prev,
          [key]: { ...prev[key], saved: false },
        }))
      }, 2000)
    } catch (err) {
      setFields((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          saving: false,
          error: err instanceof Error ? err.message : 'Save failed',
        },
      }))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">Site Content</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
        >
          Preview site ↗
        </a>
      </div>

      <div className="page-body">
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 13,
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Changes are saved to the database and immediately reflected on the homepage.
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CONTENT_FIELDS.map((field) => {
              const state = fields[field.key]
              return (
                <div
                  key={field.key}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e8e8e6',
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <label
                        htmlFor={field.key}
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#0f0f0e',
                          display: 'block',
                          marginBottom: 3,
                        }}
                      >
                        {field.label}
                      </label>
                      <p style={{ fontSize: 12, color: '#6b6b67' }}>
                        {field.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {state.saved && (
                        <span style={{ fontSize: 12, color: '#16a34a' }}>✓ Saved</span>
                      )}
                      {state.error && (
                        <span style={{ fontSize: 12, color: '#dc2626' }}>{state.error}</span>
                      )}
                      <button
                        onClick={() => handleSave(field.key)}
                        disabled={state.saving}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 12 }}
                      >
                        {state.saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    id={field.key}
                    className="form-textarea"
                    value={state.value}
                    onChange={(e) =>
                      setFields((prev) => ({
                        ...prev,
                        [field.key]: { ...prev[field.key], value: e.target.value },
                      }))
                    }
                    rows={field.rows}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
