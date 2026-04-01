'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Topic {
  title: string
  keyword: string
  intent: string
  difficulty: string
  why: string
}

interface GeneratedPost {
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  tags: string
  content: string
  featuredImage: string
}

type Step = 'topics' | 'generate' | 'review'

export default function GeneratePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('topics')
  const [niche, setNiche] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [customKeywords, setCustomKeywords] = useState('')
  const [generated, setGenerated] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleFindTopics() {
    setLoading(true)
    setError('')
    setTopics([])
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'topics', niche }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch topics')
      setTopics(data.topics || [])
      setStep('generate')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    const topic = selectedTopic ? selectedTopic.title : customTopic
    const keywords = selectedTopic ? selectedTopic.keyword : customKeywords
    if (!topic.trim()) {
      setError('Please select or enter a topic.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', topic, keywords }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate post')
      setGenerated({ ...data, featuredImage: data.featuredImage || '' })
      setStep('review')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(publish: boolean) {
    if (!generated) return
    setSaving(true)
    setError('')
    try {
      const slug = generated.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80)

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generated.title,
          slug,
          excerpt: generated.excerpt,
          content: generated.content,
          tags: generated.tags,
          metaTitle: generated.metaTitle,
          metaDescription: generated.metaDescription,
          published: publish,
          publishedAt: publish ? new Date().toISOString().split('T')[0] : null,
          featuredImage: generated.featuredImage || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post')
      router.push(`/plogin-admin/blog/${data.post.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const difficultyColor: Record<string, string> = {
    low: '#16a34a',
    medium: '#d97706',
    high: '#dc2626',
  }

  const intentColor: Record<string, string> = {
    informational: '#2563eb',
    commercial: '#7c3aed',
    navigational: '#0891b2',
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/plogin-admin/blog')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12 }}
          >
            ← Back
          </button>
          <h1 className="page-header-title" style={{ margin: 0 }}>
            AI Blog Generator
          </h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {(['topics', 'generate', 'review'] as Step[]).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: step === s ? '#0f0f0e' : steps.indexOf(step) > i ? '#0f0f0e' : '#e8e8e6',
                color: step === s || steps.indexOf(step) > i ? '#fff' : '#6b6b67',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>
                {steps.indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: step === s ? '#0f0f0e' : '#9b9b96', fontWeight: step === s ? 600 : 400 }}>
                {s === 'topics' ? 'Discover topics' : s === 'generate' ? 'Generate' : 'Review & save'}
              </span>
              {i < 2 && <span style={{ color: '#d4d4d0', fontSize: 12 }}>›</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="page-body">
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* Step 1: Discover Topics */}
        {step === 'topics' && (
          <div style={{ maxWidth: 560 }}>
            <div style={{
              background: '#ffffff', border: '1px solid #e8e8e6',
              borderRadius: 10, padding: 24,
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                Find blog topic ideas
              </h2>
              <p style={{ fontSize: 14, color: '#6b6b67', marginBottom: 20, lineHeight: 1.6 }}>
                Gemini will research and suggest high-value, SEO-ready blog topics tailored to your niche.
              </p>
              <div className="form-group">
                <label className="form-label">Your niche or website topic (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. AI content marketing, SaaS SEO, e-commerce automation"
                  onKeyDown={(e) => e.key === 'Enter' && handleFindTopics()}
                />
                <p className="form-hint">Leave blank for general content marketing topics.</p>
              </div>
              <button
                onClick={handleFindTopics}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    Researching topics with Gemini…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    Discover topics
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select & Generate */}
        {step === 'generate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {topics.length > 0 && (
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
                  Select a topic to write about
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {topics.map((t, i) => (
                    <div
                      key={i}
                      onClick={() => { setSelectedTopic(t); setCustomTopic('') }}
                      style={{
                        background: selectedTopic === t ? '#0f0f0e' : '#ffffff',
                        border: `1px solid ${selectedTopic === t ? '#0f0f0e' : '#e8e8e6'}`,
                        borderRadius: 8, padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 600,
                            color: selectedTopic === t ? '#ffffff' : '#0f0f0e',
                            marginBottom: 4,
                          }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: 12, color: selectedTopic === t ? '#a0a09c' : '#6b6b67', marginBottom: 6 }}>
                            {t.why}
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              background: selectedTopic === t ? 'rgba(255,255,255,0.1)' : '#f4f4f3',
                              color: selectedTopic === t ? '#d4d4d0' : '#6b6b67',
                            }}>
                              {t.keyword}
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              background: 'transparent',
                              color: selectedTopic === t ? '#d4d4d0' : intentColor[t.intent] || '#6b6b67',
                              border: `1px solid ${selectedTopic === t ? 'rgba(255,255,255,0.2)' : intentColor[t.intent] + '40' || '#e8e8e6'}`,
                            }}>
                              {t.intent}
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              background: 'transparent',
                              color: selectedTopic === t ? '#d4d4d0' : difficultyColor[t.difficulty] || '#6b6b67',
                              border: `1px solid ${selectedTopic === t ? 'rgba(255,255,255,0.2)' : difficultyColor[t.difficulty] + '40' || '#e8e8e6'}`,
                            }}>
                              {t.difficulty} difficulty
                            </span>
                          </div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${selectedTopic === t ? '#fff' : '#d4d4d0'}`,
                          background: selectedTopic === t ? '#fff' : 'transparent',
                          flexShrink: 0, marginTop: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {selectedTopic === t && (
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f0f0e' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: '#f9f9f8', borderRadius: 8, padding: '16px', border: '1px solid #e8e8e6' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b6b67', marginBottom: 10 }}>
                Or enter a custom topic
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  value={customTopic}
                  onChange={(e) => { setCustomTopic(e.target.value); setSelectedTopic(null) }}
                  placeholder="e.g. How to automate content publishing with AI"
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="Target keyword (optional)"
                  style={{ width: 200 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setStep('topics'); setSelectedTopic(null) }}
                className="btn btn-ghost"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || (!selectedTopic && !customTopic.trim())}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    Writing article with Gemini…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Generate article
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Save */}
        {step === 'review' && generated && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: '#f0fdf4', border: '1px solid #86efac',
                borderRadius: 8, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ fontSize: 14, color: '#15803d', fontWeight: 500 }}>
                  Article generated successfully. Review and edit before saving.
                </span>
              </div>

              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={generated.title}
                  onChange={(e) => setGenerated({ ...generated, title: e.target.value })}
                  style={{ fontSize: 18, fontWeight: 700 }}
                />
              </div>

              <div>
                <label className="form-label">Featured Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <input
                    type="url"
                    className="form-input"
                    value={generated.featuredImage}
                    onChange={(e) => setGenerated({ ...generated, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{ flex: 1 }}
                  />
                  {generated.featuredImage && (
                    <img
                      src={generated.featuredImage}
                      alt="Featured"
                      style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e6', flexShrink: 0 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Excerpt</label>
                <textarea
                  className="form-textarea"
                  value={generated.excerpt}
                  onChange={(e) => setGenerated({ ...generated, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ margin: 0 }}>Content</label>
                  <span style={{ fontSize: 12, color: '#9b9b96' }}>
                    ~{Math.round(generated.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length)} words
                  </span>
                </div>
                <textarea
                  className="form-textarea"
                  value={generated.content}
                  onChange={(e) => setGenerated({ ...generated, content: e.target.value })}
                  rows={20}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
                <p className="form-hint">HTML content — will be rendered as rich text in the editor.</p>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 80 }}>
              <div style={{
                background: '#ffffff', border: '1px solid #e8e8e6',
                borderRadius: 8, padding: 16,
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Save post</h3>
                {error && (
                  <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 10 }}>{error}</p>
                )}
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
                >
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Save as draft
                </button>
              </div>

              <div style={{
                background: '#ffffff', border: '1px solid #e8e8e6',
                borderRadius: 8, padding: 16,
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>SEO</h3>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Meta Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={generated.metaTitle}
                    onChange={(e) => setGenerated({ ...generated, metaTitle: e.target.value })}
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Meta Description</label>
                  <textarea
                    className="form-textarea"
                    value={generated.metaDescription}
                    onChange={(e) => setGenerated({ ...generated, metaDescription: e.target.value })}
                    rows={3}
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 12 }}>Tags</label>
                  <input
                    type="text"
                    className="form-input"
                    value={generated.tags}
                    onChange={(e) => setGenerated({ ...generated, tags: e.target.value })}
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>

              <button
                onClick={() => { setStep('generate'); setGenerated(null) }}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
              >
                ← Regenerate
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .page-body > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const steps: Step[] = ['topics', 'generate', 'review']
