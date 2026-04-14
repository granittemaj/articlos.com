'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

interface BatchResult {
  topic: Topic
  postId?: string
  error?: string
}

type Step = 'topics' | 'generate' | 'review' | 'batch'

const steps: Step[] = ['topics', 'generate', 'review']

async function fetchPexelsImage(query: string): Promise<string> {
  try {
    const res = await fetch(`/api/admin/pexels?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    return data.url || ''
  } catch {
    return ''
  }
}

async function generateAndSave(topic: Topic, publish: boolean = false, writingStyle: 'accessible' | 'technical' = 'accessible'): Promise<{ postId: string }> {
  // Generate content
  const genRes = await fetch('/api/admin/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generate', topic: topic.title, keywords: topic.keyword, writingStyle }),
  })
  const genData = await genRes.json()
  if (!genRes.ok) throw new Error(genData.error || 'Generation failed')

  // Fetch Pexels image in parallel
  const featuredImage = await fetchPexelsImage(topic.keyword || topic.title)

  const slug = genData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

  const saveRes = await fetch('/api/admin/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: genData.title,
      slug,
      excerpt: genData.excerpt,
      content: genData.content,
      tags: genData.tags,
      metaTitle: genData.metaTitle,
      metaDescription: genData.metaDescription,
      published: publish,
      publishedAt: publish ? new Date().toISOString().split('T')[0] : null,
      featuredImage: featuredImage || null,
    }),
  })
  const saveData = await saveRes.json()
  if (!saveRes.ok) throw new Error(saveData.error || 'Save failed')
  return { postId: saveData.post.id }
}

export default function GeneratePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('topics')
  const [niche, setNiche] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set())
  const [customTopic, setCustomTopic] = useState('')
  const [customKeywords, setCustomKeywords] = useState('')
  const [generated, setGenerated] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [fetchingImage, setFetchingImage] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Keyword suggestions for step 1 — grouped by intent
  const [keywordGroups, setKeywordGroups] = useState<{ intent: string; keywords: string[] }[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [loadingKeywords, setLoadingKeywords] = useState(false)

  // Publish status (draft or publish) — chosen before generating
  const [publishStatus, setPublishStatus] = useState<'draft' | 'publish'>('draft')

  // Batch state
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null)

  // Style preferences
  const [topicStyle, setTopicStyle] = useState<'accessible' | 'technical'>('accessible')
  const [writingStyle, setWritingStyle] = useState<'accessible' | 'technical'>('accessible')

  // Queue save state
  const [savingToQueue, setSavingToQueue] = useState(false)
  const [queueMessage, setQueueMessage] = useState('')

  const MAX_SELECT = 3

  async function saveToQueue(topicsToSave: Topic[]) {
    setSavingToQueue(true)
    setQueueMessage('')
    setError('')
    try {
      const res = await fetch('/api/admin/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: topicsToSave, niche }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save to queue')
      setQueueMessage(`${data.added} topic${data.added === 1 ? '' : 's'} saved to queue`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save to queue')
    } finally {
      setSavingToQueue(false)
    }
  }

  function toggleTopic(i: number) {
    setSelectedIndexes(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else if (next.size < MAX_SELECT) {
        next.add(i)
        setCustomTopic('')
      }
      return next
    })
  }

  async function handleFindTopics() {
    setLoading(true)
    setError('')
    setTopics([])
    setSelectedIndexes(new Set())
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'topics',
          niche,
          topicStyle,
          selectedKeywords: selectedKeywords.size > 0 ? Array.from(selectedKeywords) : undefined,
        }),
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

  async function handleSuggest() {
    setSuggesting(true)
    setError('')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', niche, context: customTopic }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get suggestion')
      setCustomTopic(data.title || '')
      setCustomKeywords(data.keyword || '')
      setSelectedIndexes(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSuggesting(false)
    }
  }

  // Single generate → review step
  async function handleGenerateSingle() {
    const topicTitle = selectedIndexes.size === 1
      ? topics[Array.from(selectedIndexes)[0]].title
      : customTopic
    const keywords = selectedIndexes.size === 1
      ? topics[Array.from(selectedIndexes)[0]].keyword
      : customKeywords

    if (!topicTitle.trim()) {
      setError('Please select or enter a topic.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', topic: topicTitle, keywords, writingStyle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate post')

      // Fetch Pexels image
      setFetchingImage(true)
      const imgUrl = await fetchPexelsImage(keywords || topicTitle)
      setFetchingImage(false)

      setGenerated({ ...data, featuredImage: imgUrl || data.featuredImage || '' })
      setStep('review')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setFetchingImage(false)
    } finally {
      setLoading(false)
    }
  }

  // Batch generate → batch results step
  async function handleGenerateBatch() {
    const selected = Array.from(selectedIndexes).map(i => topics[i])
    setBatchResults([])
    setBatchProgress({ current: 0, total: selected.length, title: '' })
    setStep('batch')

    const results: BatchResult[] = []
    for (let i = 0; i < selected.length; i++) {
      const topic = selected[i]
      setBatchProgress({ current: i + 1, total: selected.length, title: topic.title })
      try {
        const { postId } = await generateAndSave(topic, publishStatus === 'publish', writingStyle)
        results.push({ topic, postId })
      } catch (e) {
        results.push({ topic, error: e instanceof Error ? e.message : 'Failed' })
      }
      setBatchResults([...results])
    }
    setBatchProgress(null)
  }

  function handleGenerate() {
    if (selectedIndexes.size > 1) {
      handleGenerateBatch()
    } else {
      handleGenerateSingle()
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

  const selectedCount = selectedIndexes.size
  const isMulti = selectedCount > 1
  const canGenerate = selectedCount > 0 || customTopic.trim().length > 0

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
        {step !== 'batch' && (
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
        )}
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
              <div className="form-group">
                <label className="form-label">Topic complexity</label>
                <select
                  className="form-input"
                  value={topicStyle}
                  onChange={(e) => setTopicStyle(e.target.value as 'accessible' | 'technical')}
                >
                  <option value="accessible">Accessible — easy to understand, plain language</option>
                  <option value="technical">Technical — expert-level, industry jargon OK</option>
                </select>
              </div>

              {/* Keyword suggestions — grouped by intent */}
              <div style={{ marginTop: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <button
                    onClick={async () => {
                      setLoadingKeywords(true)
                      setKeywordGroups([])
                      setSelectedKeywords(new Set())
                      try {
                        const res = await fetch('/api/admin/ai', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'keywords', niche }),
                        })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data.error || 'Failed')
                        setKeywordGroups(data.groups || [])
                      } catch (e) {
                        setError(e instanceof Error ? e.message : 'Failed to suggest keywords')
                      } finally {
                        setLoadingKeywords(false)
                      }
                    }}
                    disabled={loadingKeywords || loading || suggesting}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12, gap: 6 }}
                  >
                    {loadingKeywords ? (
                      <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span> Suggesting keywords…</>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                        </svg>
                        Suggest keywords
                      </>
                    )}
                  </button>
                  {selectedKeywords.size > 0 && (
                    <span style={{ fontSize: 12, color: '#6b6b67' }}>
                      {selectedKeywords.size} selected — topics will focus on these
                    </span>
                  )}
                </div>

                {loadingKeywords && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 4, marginBottom: 8 }} />
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="skeleton" style={{ height: 26, width: 80 + j * 20, borderRadius: 14 }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {keywordGroups.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {keywordGroups.map((group) => {
                      const intentColors: Record<string, { bg: string; color: string; border: string }> = {
                        'how-to':       { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
                        'informational':{ bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                        'commercial':   { bg: '#faf5ff', color: '#7c3aed', border: '#d8b4fe' },
                        'navigational': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
                      }
                      const ic = intentColors[group.intent] || { bg: '#f4f4f3', color: '#6b6b67', border: '#e8e8e6' }
                      return (
                        <div key={group.intent}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: ic.color,
                            background: ic.bg,
                            border: `1px solid ${ic.border}`,
                            padding: '2px 8px', borderRadius: 4,
                            marginBottom: 8,
                          }}>
                            {group.intent}
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {group.keywords.map((kw) => {
                              const isSelected = selectedKeywords.has(kw)
                              return (
                                <button
                                  key={kw}
                                  onClick={() => {
                                    setSelectedKeywords(prev => {
                                      const next = new Set(prev)
                                      if (next.has(kw)) next.delete(kw)
                                      else next.add(kw)
                                      return next
                                    })
                                  }}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    padding: '4px 12px', borderRadius: 20,
                                    fontSize: 12, fontWeight: isSelected ? 600 : 400,
                                    background: isSelected ? '#0f0f0e' : '#f4f4f3',
                                    color: isSelected ? '#ffffff' : '#0f0f0e',
                                    border: `1px solid ${isSelected ? '#0f0f0e' : '#e8e8e6'}`,
                                    cursor: 'pointer', fontFamily: 'Geist, sans-serif',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {isSelected && (
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: 4 }}>
                                      <polyline points="2 6 5 9 10 3" />
                                    </svg>
                                  )}
                                  {kw}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={async () => {
                    setSuggesting(true)
                    setError('')
                    try {
                      const res = await fetch('/api/admin/ai', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'suggest', niche }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data.error || 'Failed to get suggestion')
                      setCustomTopic(data.title || '')
                      setCustomKeywords(data.keyword || '')
                      setSelectedIndexes(new Set())
                      setStep('generate')
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Something went wrong')
                    } finally {
                      setSuggesting(false)
                    }
                  }}
                  disabled={suggesting || loading}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'center', flex: 1, gap: 6 }}
                >
                  {suggesting ? (
                    <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span> Suggesting…</>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                      </svg>
                      Suggest one topic
                    </>
                  )}
                </button>
                <button
                  onClick={handleFindTopics}
                  disabled={loading || suggesting}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', flex: 2 }}
                >
                  {loading ? (
                    <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span> Researching…</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                      </svg>
                      {selectedKeywords.size > 0 ? `Discover 8 topics for ${selectedKeywords.size} keyword${selectedKeywords.size === 1 ? '' : 's'}` : 'Discover 8 topics'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select & Generate */}
        {step === 'generate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {topics.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Select topics to generate
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#9b9b96' }}>
                      {selectedCount === 0 ? 'Select up to 3' : `${selectedCount} of ${MAX_SELECT} selected`}
                    </span>
                    {selectedCount > 0 && (
                      <button
                        onClick={() => saveToQueue(Array.from(selectedIndexes).map(i => topics[i]))}
                        disabled={savingToQueue}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 12, gap: 4 }}
                      >
                        {savingToQueue ? (
                          <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span> Saving…</>
                        ) : (
                          <>Save selected to queue</>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => saveToQueue(topics)}
                      disabled={savingToQueue}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 12, gap: 4 }}
                    >
                      {savingToQueue ? (
                        <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span> Saving…</>
                      ) : (
                        <>Save all to queue</>
                      )}
                    </button>
                  </div>
                </div>
                {queueMessage && (
                  <div style={{
                    background: '#f0fdf4', border: '1px solid #86efac',
                    borderRadius: 8, padding: '10px 14px', marginBottom: 10,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style={{ fontSize: 13, color: '#15803d' }}>{queueMessage}</span>
                    <Link href="/plogin-admin/queue" style={{ fontSize: 13, fontWeight: 500, color: '#15803d', marginLeft: 'auto' }}>
                      View queue →
                    </Link>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {topics.map((t, i) => {
                    const isSelected = selectedIndexes.has(i)
                    const isDisabled = !isSelected && selectedCount >= MAX_SELECT
                    return (
                      <div
                        key={i}
                        onClick={() => !isDisabled && toggleTopic(i)}
                        style={{
                          background: isSelected ? '#0f0f0e' : '#ffffff',
                          border: `1px solid ${isSelected ? '#0f0f0e' : '#e8e8e6'}`,
                          borderRadius: 8, padding: '14px 16px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.45 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          {/* Checkbox */}
                          <div style={{
                            width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                            border: `2px solid ${isSelected ? '#fff' : '#d4d4d0'}`,
                            background: isSelected ? '#fff' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {isSelected && (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0f0f0e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="2 6 5 9 10 3" />
                              </svg>
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: 14, fontWeight: 600,
                              color: isSelected ? '#ffffff' : '#0f0f0e',
                              marginBottom: 4,
                            }}>
                              {t.title}
                            </div>
                            <div style={{ fontSize: 12, color: isSelected ? '#a0a09c' : '#6b6b67', marginBottom: 6 }}>
                              {t.why}
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                background: isSelected ? 'rgba(255,255,255,0.1)' : '#f4f4f3',
                                color: isSelected ? '#d4d4d0' : '#6b6b67',
                              }}>
                                {t.keyword}
                              </span>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                background: 'transparent',
                                color: isSelected ? '#d4d4d0' : intentColor[t.intent] || '#6b6b67',
                                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : (intentColor[t.intent] || '#6b6b67') + '40'}`,
                              }}>
                                {t.intent}
                              </span>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                background: 'transparent',
                                color: isSelected ? '#d4d4d0' : difficultyColor[t.difficulty] || '#6b6b67',
                                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : (difficultyColor[t.difficulty] || '#6b6b67') + '40'}`,
                              }}>
                                {t.difficulty} difficulty
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ background: '#f9f9f8', borderRadius: 8, padding: '16px', border: '1px solid #e8e8e6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6b6b67', margin: 0 }}>
                  Or enter a custom topic
                </p>
                <button
                  onClick={handleSuggest}
                  disabled={suggesting}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 6,
                    background: '#0f0f0e', color: '#ffffff',
                    border: 'none', fontSize: 12, fontWeight: 500,
                    cursor: suggesting ? 'not-allowed' : 'pointer',
                    opacity: suggesting ? 0.6 : 1,
                    fontFamily: 'Geist, sans-serif',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                  {suggesting ? 'Suggesting…' : 'Suggest everything'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  value={customTopic}
                  onChange={(e) => { setCustomTopic(e.target.value); setSelectedIndexes(new Set()) }}
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

            {/* Writing style + publish status */}
            <div style={{
              background: '#ffffff', border: '1px solid #e8e8e6',
              borderRadius: 8, padding: '14px 16px',
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f0f0e', marginBottom: 10 }}>
                After generating
              </p>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ fontSize: 12 }}>Writing style</label>
                <select
                  className="form-input"
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value as 'accessible' | 'technical')}
                  style={{ fontSize: 13 }}
                >
                  <option value="accessible">Accessible — simple language, beginner-friendly</option>
                  <option value="technical">Technical — expert tone, jargon allowed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
                  border: `1.5px solid ${publishStatus === 'draft' ? '#0f0f0e' : '#e8e8e6'}`,
                  background: publishStatus === 'draft' ? '#f8f8f7' : '#ffffff',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="publishStatus"
                    checked={publishStatus === 'draft'}
                    onChange={() => setPublishStatus('draft')}
                    style={{ accentColor: '#0f0f0e' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Save as draft</div>
                    <div style={{ fontSize: 11, color: '#9b9b96' }}>Review first</div>
                  </div>
                </label>
                <label style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
                  border: `1.5px solid ${publishStatus === 'publish' ? '#0f0f0e' : '#e8e8e6'}`,
                  background: publishStatus === 'publish' ? '#f8f8f7' : '#ffffff',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="publishStatus"
                    checked={publishStatus === 'publish'}
                    onChange={() => setPublishStatus('publish')}
                    style={{ accentColor: '#0f0f0e' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Publish immediately</div>
                    <div style={{ fontSize: 11, color: '#9b9b96' }}>Goes live right away</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Info banner for multi-select */}
            {isMulti && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: 13, color: '#1d4ed8' }}>
                  {selectedCount} articles will be generated and {publishStatus === 'publish' ? 'published' : 'saved as drafts'} automatically. Featured images from Pexels will be added to each.
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setStep('topics'); setSelectedIndexes(new Set()) }}
                className="btn btn-ghost"
              >
                ← Back
              </button>
              <Link
                href="/plogin-admin/queue"
                className="btn btn-ghost"
                style={{ textDecoration: 'none', gap: 6 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                View queue →
              </Link>
              <button
                onClick={handleGenerate}
                disabled={loading || !canGenerate}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    {fetchingImage ? 'Fetching image…' : 'Writing article with Gemini…'}
                  </>
                ) : isMulti ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Generate {selectedCount} articles
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

        {/* Batch progress + results */}
        {step === 'batch' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                Generating {batchProgress ? `${batchProgress.current} of ${batchProgress.total}` : batchResults.length} articles
              </h2>
              {batchProgress && (
                <p style={{ fontSize: 14, color: '#6b6b67' }}>
                  Writing: <span style={{ color: '#0f0f0e', fontWeight: 500 }}>{batchProgress.title}</span>
                </p>
              )}
            </div>

            {/* Progress bar */}
            {batchProgress && (
              <div style={{
                height: 4, background: '#e8e8e6', borderRadius: 2,
                marginBottom: 24, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', background: '#0f0f0e', borderRadius: 2,
                  width: `${((batchProgress.current - 1 + batchResults.length / batchProgress.total) / batchProgress.total) * 100}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {batchResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: r.error ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${r.error ? '#fca5a5' : '#86efac'}`,
                    borderRadius: 8, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  {r.error ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: r.error ? '#dc2626' : '#15803d' }}>
                      {r.topic.title}
                    </div>
                    {r.error && (
                      <div style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>{r.error}</div>
                    )}
                  </div>
                  {r.postId && (
                    <Link
                      href={`/plogin-admin/blog/${r.postId}`}
                      style={{
                        fontSize: 13, fontWeight: 500, color: '#15803d',
                        textDecoration: 'none', whiteSpace: 'nowrap',
                        padding: '4px 10px', borderRadius: 6,
                        border: '1px solid #86efac',
                        background: '#fff',
                      }}
                    >
                      {publishStatus === 'publish' ? 'View post →' : 'Edit draft →'}
                    </Link>
                  )}
                </div>
              ))}

              {/* Spinner for in-progress item */}
              {batchProgress && (
                <div style={{
                  background: '#ffffff', border: '1px solid #e8e8e6',
                  borderRadius: 8, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 16, color: '#9b9b96' }}>◌</span>
                  <div style={{ fontSize: 14, color: '#6b6b67' }}>
                    Generating &amp; finding image for <span style={{ fontWeight: 500, color: '#0f0f0e' }}>{batchProgress.title}</span>…
                  </div>
                </div>
              )}
            </div>

            {!batchProgress && (
              <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setStep('generate'); setBatchResults([]) }}
                  className="btn btn-ghost"
                >
                  ← Generate more
                </button>
                <Link href="/plogin-admin/blog" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  View all posts →
                </Link>
              </div>
            )}
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
                <label className="form-label">Featured Image</label>
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
                      style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e6', flexShrink: 0 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                {generated.featuredImage && (
                  <p className="form-hint">Image sourced from Pexels. You can replace it with any URL.</p>
                )}
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
