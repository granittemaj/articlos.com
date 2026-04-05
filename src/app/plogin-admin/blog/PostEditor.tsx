'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

interface PostData {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  featuredImageAlt: string
  tags: string
  published: boolean
  publishedAt: string
  metaTitle: string
  metaDescription: string
}

interface PostVersion {
  id: string
  title: string
  excerpt: string | null
  content: string
  savedAt: string
}

interface PostEditorProps {
  initialData?: Partial<PostData>
  postId?: string
}

const defaultData: PostData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  featuredImageAlt: '',
  tags: '',
  published: false,
  publishedAt: new Date().toISOString().split('T')[0],
  metaTitle: '',
  metaDescription: '',
}

export default function PostEditor({ initialData, postId }: PostEditorProps) {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const isEditMode = !!postId

  const [form, setForm] = useState<PostData>(() => {
    if (initialData) {
      return {
        ...defaultData,
        ...initialData,
        publishedAt: initialData.publishedAt
          ? new Date(initialData.publishedAt).toISOString().split('T')[0]
          : defaultData.publishedAt,
        tags: initialData.tags || '',
        featuredImage: initialData.featuredImage || '',
        featuredImageAlt: initialData.featuredImageAlt || '',
        excerpt: initialData.excerpt || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
      }
    }
    return defaultData
  })

  const [tagInput, setTagInput] = useState('')
  const [tagList, setTagList] = useState<string[]>(() => {
    if (initialData?.tags) {
      return initialData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    }
    return []
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    setImageError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      updateField('featuredImage', data.url)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!postId)
  const [previewMode, setPreviewMode] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiKeywords, setAiKeywords] = useState('')
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [versionsOpen, setVersionsOpen] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }))
    }
  }, [form.title, slugManuallyEdited])

  // Init editor content
  useEffect(() => {
    if (editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content
    }
  }, [])

  // Load version history for existing posts
  useEffect(() => {
    if (!postId) return
    fetch(`/api/admin/posts/${postId}/versions`)
      .then((r) => r.json())
      .then((d) => setVersions(d.versions || []))
      .catch(() => {})
  }, [postId])

  function updateField<K extends keyof PostData>(key: K, value: PostData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Tag handling
  function addTag(raw: string) {
    const tag = raw.trim().replace(/,/g, '')
    if (tag && !tagList.includes(tag)) {
      const newList = [...tagList, tag]
      setTagList(newList)
      setForm((prev) => ({ ...prev, tags: newList.join(', ') }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    const newList = tagList.filter((t) => t !== tag)
    setTagList(newList)
    setForm((prev) => ({ ...prev, tags: newList.join(', ') }))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Rich text toolbar commands
  const execCmd = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
  }, [])

  function insertHtml(html: string) {
    editorRef.current?.focus()
    document.execCommand('insertHTML', false, html)
  }

  function insertHeading(level: number) {
    editorRef.current?.focus()
    document.execCommand('formatBlock', false, `h${level}`)
  }

  function handleInsertLink() {
    const url = prompt('Enter URL:')
    if (url) {
      const sel = window.getSelection()
      const text = sel?.toString() || url
      insertHtml(`<a href="${url}" target="_blank">${text}</a>`)
    }
  }

  function handleInsertImage() {
    const url = prompt('Enter image URL:')
    if (url) {
      insertHtml(`<img src="${url}" alt="" style="max-width:100%; border-radius:8px;" />`)
    }
  }

  function handleEditorInput() {
    if (editorRef.current) {
      updateField('content', editorRef.current.innerHTML)
    }
  }

  // AI generate
  async function handleAiGenerate() {
    if (!form.title.trim()) {
      setAiError('Add a title first so Gemini knows what to write.')
      return
    }
    setAiLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', topic: form.title, keywords: aiKeywords }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI generation failed')

      // Fill in the generated fields
      if (data.excerpt) updateField('excerpt', data.excerpt)
      if (data.tags) {
        const tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        setTagList(tags)
        updateField('tags', data.tags)
      }
      if (data.metaTitle) updateField('metaTitle', data.metaTitle)
      if (data.metaDescription) updateField('metaDescription', data.metaDescription)
      if (data.content && editorRef.current) {
        editorRef.current.innerHTML = data.content
        updateField('content', data.content)
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setAiLoading(false)
    }
  }

  // Save post
  async function handleSave(publishState?: boolean) {
    setSaveError('')
    setSaveSuccess('')

    if (!form.title.trim()) {
      setSaveError('Title is required.')
      return
    }
    if (!form.slug.trim()) {
      setSaveError('Slug is required.')
      return
    }

    const content = editorRef.current?.innerHTML || form.content
    if (!content.trim() || content === '<br>') {
      setSaveError('Content is required.')
      return
    }

    setSaving(true)

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content,
      featuredImage: form.featuredImage || null,
      featuredImageAlt: form.featuredImageAlt || null,
      tags: form.tags || null,
      published: publishState !== undefined ? publishState : form.published,
      publishedAt: form.publishedAt || null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
    }

    try {
      const url = isEditMode ? `/api/admin/posts/${postId}` : '/api/admin/posts'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setSaveError(data.error || 'Failed to save post.')
        return
      }

      setSaveSuccess(isEditMode ? 'Post updated successfully.' : 'Post created successfully.')

      if (!isEditMode) {
        router.push(`/plogin-admin/blog/${data.post.id}`)
      } else {
        // Update form with returned data
        setForm((prev) => ({
          ...prev,
          published: data.post.published,
        }))
      }
    } catch {
      setSaveError('Network error. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveSuccess(''), 3000)
    }
  }

  const toolbarButtons = [
    { label: 'H1', title: 'Heading 1', action: () => insertHeading(1) },
    { label: 'H2', title: 'Heading 2', action: () => insertHeading(2) },
    { label: 'H3', title: 'Heading 3', action: () => insertHeading(3) },
    { type: 'sep' },
    { label: 'B', title: 'Bold', action: () => execCmd('bold'), style: { fontWeight: 700 } },
    { label: 'I', title: 'Italic', action: () => execCmd('italic'), style: { fontStyle: 'italic' } },
    { label: 'U', title: 'Underline', action: () => execCmd('underline'), style: { textDecoration: 'underline' } },
    { type: 'sep' },
    { label: 'Link', title: 'Insert Link', action: handleInsertLink },
    { label: 'UL', title: 'Bullet List', action: () => execCmd('insertUnorderedList') },
    { label: 'OL', title: 'Numbered List', action: () => execCmd('insertOrderedList') },
    { type: 'sep' },
    { label: '"', title: 'Blockquote', action: () => execCmd('formatBlock', 'blockquote') },
    { label: '<>', title: 'Code block', action: () => insertHtml('<pre><code>code here</code></pre>') },
    { label: '—', title: 'Horizontal Rule', action: () => insertHtml('<hr/>') },
    { label: 'Img', title: 'Insert Image', action: handleInsertImage },
  ]

  const metaTitleLength = form.metaTitle.length
  const metaDescLength = form.metaDescription.length

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-header-title">
          {isEditMode ? 'Edit Post' : 'New Post'}
        </h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saveSuccess && (
            <span style={{ fontSize: 13, color: '#16a34a' }}>{saveSuccess}</span>
          )}
          {saveError && (
            <span style={{ fontSize: 13, color: '#dc2626' }}>{saveError}</span>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="btn btn-ghost btn-sm"
          >
            {saving ? 'Saving...' : 'Save draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn btn-primary btn-sm"
          >
            {form.published ? 'Update & publish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="page-body">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 24,
            alignItems: 'start',
          }}
          className="editor-layout"
        >
          {/* ============ LEFT: Content ============ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Title */}
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Post title…"
              style={{
                width: '100%',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                border: 'none',
                borderBottom: '1px solid #e8e8e6',
                padding: '8px 0 16px',
                outline: 'none',
                background: 'transparent',
                color: '#0f0f0e',
                fontFamily: 'Geist, sans-serif',
              }}
            />

            {/* Slug */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#a0a09c', flexShrink: 0 }}>articlos.com/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true)
                  updateField('slug', e.target.value.replace(/\s+/g, '-').toLowerCase())
                }}
                placeholder="post-slug"
                style={{
                  flex: 1,
                  fontSize: 13,
                  padding: '6px 10px',
                  border: '1px solid #e8e8e6',
                  borderRadius: 5,
                  outline: 'none',
                  fontFamily: 'Geist, sans-serif',
                  color: '#0f0f0e',
                  background: '#f8f8f7',
                }}
              />
            </div>

            {/* Featured Image */}
            <div className="form-group">
              <label className="form-label">Featured Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              {form.featuredImage ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={form.featuredImage}
                    alt="Featured"
                    style={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #e8e8e6',
                      display: 'block',
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => updateField('featuredImage', '')}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: 15,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    aria-label="Remove image"
                  >×</button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 8 }}
                  >
                    {imageUploading ? 'Uploading…' : 'Change image'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  style={{
                    width: '100%', padding: '28px 16px',
                    border: '2px dashed #e8e8e6', borderRadius: 8,
                    background: '#f8f8f7', cursor: imageUploading ? 'not-allowed' : 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6, color: '#a0a09c',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    fontFamily: 'Geist, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    if (!imageUploading) {
                      e.currentTarget.style.borderColor = '#c8c8c4'
                      e.currentTarget.style.background = '#f0f0ee'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e6'
                    e.currentTarget.style.background = '#f8f8f7'
                  }}
                >
                  {imageUploading ? (
                    <span style={{ fontSize: 13 }}>Uploading…</span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>Upload image</span>
                      <span style={{ fontSize: 11 }}>PNG, JPG, WebP · max 5 MB</span>
                    </>
                  )}
                </button>
              )}
              {imageError && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 6 }}>{imageError}</p>}
              <p className="form-hint" style={{ marginTop: 6 }}>Or paste a URL directly:</p>
              <input
                type="url"
                className="form-input"
                value={form.featuredImage}
                onChange={(e) => updateField('featuredImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ marginTop: 4 }}
              />
              {form.featuredImage && (
                <>
                  <p className="form-hint" style={{ marginTop: 8 }}>Alt text (for accessibility & SEO):</p>
                  <input
                    type="text"
                    className="form-input"
                    value={form.featuredImageAlt}
                    onChange={(e) => updateField('featuredImageAlt', e.target.value)}
                    placeholder="Describe the image…"
                    style={{ marginTop: 4 }}
                  />
                </>
              )}
            </div>

            {/* Excerpt */}
            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                className="form-textarea"
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                placeholder="A short summary of the post…"
                rows={2}
              />
            </div>

            {/* Content Editor */}
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <label className="form-label">Content</label>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>

              {previewMode ? (
                <div
                  className="post-content"
                  style={{
                    minHeight: 400,
                    padding: '16px',
                    border: '1px solid #e8e8e6',
                    borderRadius: 8,
                    background: '#ffffff',
                    overflowY: 'auto',
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      editorRef.current?.innerHTML ||
                      form.content ||
                      '<p style="color:#a0a09c;">Nothing to preview yet.</p>',
                  }}
                />
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="editor-toolbar">
                    {toolbarButtons.map((btn, i) => {
                      if ('type' in btn && btn.type === 'sep') {
                        return <div key={i} className="toolbar-sep" />
                      }
                      const b = btn as { label: string; title: string; action: () => void; style?: React.CSSProperties }
                      return (
                        <button
                          key={i}
                          title={b.title}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            b.action()
                          }}
                          className="toolbar-btn"
                          style={b.style || {}}
                        >
                          {b.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Content editable */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    className="rich-editor post-content"
                    data-placeholder="Start writing your post…"
                    style={{
                      minHeight: 400,
                      borderRadius: '0 0 8px 8px',
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* ============ RIGHT: Sidebar ============ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              position: 'sticky',
              top: 80,
            }}
          >
            {/* Publish */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8e6',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>Publish</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => updateField('published', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <p style={{ fontSize: 12, color: '#6b6b67', marginBottom: 16 }}>
                {form.published
                  ? 'This post is live on your blog.'
                  : 'This post is saved as a draft.'}
              </p>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12 }}>Publish date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.publishedAt}
                  onChange={(e) => updateField('publishedAt', e.target.value)}
                />
              </div>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              >
                {saving ? 'Saving...' : form.published ? 'Update & publish' : 'Publish'}
              </button>
            </div>

            {/* Tags */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8e6',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {tagList.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="tag-chip-remove"
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput.trim() && addTag(tagInput)}
                placeholder="Add tag, press Enter"
                style={{ fontSize: 13 }}
              />
              <p className="form-hint" style={{ marginTop: 4 }}>
                Press Enter or comma to add.
              </p>
            </div>

            {/* AI Generate */}
            <div style={{
              background: '#0f0f0e',
              border: '1px solid #0f0f0e',
              borderRadius: 8, padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Write with Gemini</h3>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>
                Generate a full article from your title. Fills content, excerpt, tags, and SEO fields.
              </p>
              <input
                type="text"
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                placeholder="Target keyword (optional)"
                style={{
                  width: '100%', fontSize: 12, padding: '7px 10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 5, background: 'rgba(255,255,255,0.07)',
                  color: '#ffffff', outline: 'none', fontFamily: 'Geist, sans-serif',
                  marginBottom: 8, boxSizing: 'border-box',
                }}
              />
              {aiError && (
                <p style={{ fontSize: 11, color: '#fca5a5', marginBottom: 8 }}>{aiError}</p>
              )}
              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 5,
                  background: aiLoading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: '#ffffff', fontSize: 12, fontWeight: 500,
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Geist, sans-serif',
                  transition: 'background 0.15s ease',
                }}
              >
                {aiLoading ? 'Writing with Gemini…' : 'Generate article'}
              </button>
            </div>

            {/* SEO */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8e6',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>SEO</h3>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Meta Title</label>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: metaTitleLength > 60 ? '#dc2626' : '#a0a09c',
                  }}>
                    {metaTitleLength}/60
                  </span>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={form.metaTitle}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                  placeholder={form.title || 'SEO title'}
                  style={{ fontSize: 13, borderColor: metaTitleLength > 60 ? '#fca5a5' : undefined }}
                />
                {metaTitleLength > 60 && (
                  <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>
                    Exceeds 60 characters. Search engines may truncate this.
                  </p>
                )}
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Meta Description</label>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: metaDescLength > 160 ? '#dc2626' : '#a0a09c',
                    }}
                  >
                    {metaDescLength}/160
                  </span>
                </div>
                <textarea
                  className="form-textarea"
                  value={form.metaDescription}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="Brief description for search engines…"
                  rows={3}
                  style={{
                    fontSize: 13,
                    borderColor: metaDescLength > 160 ? '#fca5a5' : undefined,
                  }}
                />
                {metaDescLength > 160 && (
                  <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>
                    Exceeds 160 characters. Search engines may truncate this.
                  </p>
                )}
              </div>
            </div>
            {/* Google SERP Preview */}
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#0f0f0e' }}>Search preview</h3>
              <div style={{ padding: '12px 14px', background: '#f9f9f8', borderRadius: 6, border: '1px solid #e8e8e6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: '#e8e8e6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#6b6b67' }}>A</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#6b6b67' }}>
                    articlos.com › blog › {form.slug || 'post-slug'}
                  </span>
                </div>
                <div style={{
                  fontSize: 14, color: '#1a0dab', fontWeight: 500, lineHeight: 1.3,
                  marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {(form.metaTitle || form.title || 'Page title') + ' | articlos'}
                </div>
                <div style={{
                  fontSize: 12, color: '#4d5156', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {form.metaDescription || form.excerpt || 'Meta description will appear here. Aim for 120–160 characters.'}
                </div>
              </div>
            </div>

            {/* Version History */}
            {isEditMode && versions.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  onClick={() => setVersionsOpen((v) => !v)}
                  style={{
                    width: '100%', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Geist, sans-serif',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f0f0e' }}>
                    Version history ({versions.length})
                  </span>
                  <span style={{ fontSize: 14, color: '#9b9b96', transform: versionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
                </button>
                {versionsOpen && (
                  <div style={{ borderTop: '1px solid #e8e8e6' }}>
                    {versions.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          padding: '10px 16px',
                          borderBottom: '1px solid #f0f0ee',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: '#0f0f0e', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#a0a09c', marginTop: 2 }}>
                            {new Date(v.savedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            {' · '}{Math.round(v.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length)} words
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!confirm('Restore this version? Current content will be replaced.')) return
                            if (editorRef.current) {
                              editorRef.current.innerHTML = v.content
                              updateField('content', v.content)
                            }
                            if (v.title) updateField('title', v.title)
                            if (v.excerpt) updateField('excerpt', v.excerpt)
                          }}
                          style={{
                            fontSize: 11, padding: '3px 8px', borderRadius: 4,
                            border: '1px solid #e8e8e6', background: '#f9f9f8',
                            color: '#3d3d3a', cursor: 'pointer', whiteSpace: 'nowrap',
                            fontFamily: 'Geist, sans-serif',
                          }}
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #c8c8c4;
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
