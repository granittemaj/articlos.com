'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Entry {
  title: string
  description: string
}

interface Section {
  month: string
  entries: Entry[]
}

export default function AdminChangelogPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/changelog')
      .then((r) => r.json())
      .then((d) => { setSections(d.changelog || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/changelog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changelog: sections }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addSection() {
    setSections([{ month: '', entries: [{ title: '', description: '' }] }, ...sections])
  }

  function removeSection(si: number) {
    setSections(sections.filter((_, i) => i !== si))
  }

  function updateMonth(si: number, val: string) {
    setSections(sections.map((s, i) => i === si ? { ...s, month: val } : s))
  }

  function addEntry(si: number) {
    setSections(sections.map((s, i) =>
      i === si ? { ...s, entries: [...s.entries, { title: '', description: '' }] } : s
    ))
  }

  function removeEntry(si: number, ei: number) {
    setSections(sections.map((s, i) =>
      i === si ? { ...s, entries: s.entries.filter((_, j) => j !== ei) } : s
    ))
  }

  function updateEntry(si: number, ei: number, field: keyof Entry, val: string) {
    setSections(sections.map((s, i) =>
      i === si
        ? { ...s, entries: s.entries.map((e, j) => j === ei ? { ...e, [field]: val } : e) }
        : s
    ))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e8e8e6',
    borderRadius: 6,
    fontSize: 13,
    color: '#0f0f0e',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: '#ffffff',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9' }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e8e8e6',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/plogin-admin" style={{ color: '#6b6b67', textDecoration: 'none', fontSize: 13 }}>
            ← Admin
          </Link>
          <span style={{ color: '#e8e8e6' }}>/</span>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: '#0f0f0e', margin: 0 }}>Changelog</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={addSection}
            style={{
              padding: '8px 16px',
              border: '1px solid #e8e8e6',
              borderRadius: 6,
              background: '#ffffff',
              color: '#3d3d3a',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Add month
          </button>
          <button
            onClick={save}
            disabled={saving}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              background: saved ? '#16a34a' : '#0f0f0e',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <p style={{ color: '#6b6b67', fontSize: 14 }}>Loading…</p>
        ) : sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#6b6b67' }}>
            <p style={{ fontSize: 15, marginBottom: 16 }}>No changelog entries yet.</p>
            <button
              onClick={addSection}
              style={{
                padding: '10px 20px',
                background: '#0f0f0e',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Add first month
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sections.map((section, si) => (
              <div key={si} style={{
                background: '#ffffff',
                border: '1px solid #e8e8e6',
                borderRadius: 10,
                padding: '20px 24px',
              }}>
                {/* Month row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <input
                    value={section.month}
                    onChange={(e) => updateMonth(si, e.target.value)}
                    placeholder="e.g. April 2026"
                    style={{ ...inputStyle, fontWeight: 600, fontSize: 14 }}
                  />
                  <button
                    onClick={() => removeSection(si)}
                    title="Remove section"
                    style={{
                      flexShrink: 0,
                      padding: '8px 10px',
                      border: '1px solid #fecaca',
                      borderRadius: 6,
                      background: '#fff5f5',
                      color: '#dc2626',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Entries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.entries.map((entry, ei) => (
                    <div key={ei} style={{
                      border: '1px solid #f0f0ee',
                      borderRadius: 8,
                      padding: '14px 16px',
                      background: '#fafaf9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            value={entry.title}
                            onChange={(e) => updateEntry(si, ei, 'title', e.target.value)}
                            placeholder="Feature title"
                            style={inputStyle}
                          />
                        </div>
                        <button
                          onClick={() => removeEntry(si, ei)}
                          title="Remove entry"
                          style={{
                            flexShrink: 0,
                            padding: '8px 10px',
                            border: '1px solid #e8e8e6',
                            borderRadius: 6,
                            background: '#ffffff',
                            color: '#6b6b67',
                            fontSize: 12,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(si, ei, 'description', e.target.value)}
                        placeholder="Description of the feature or change"
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addEntry(si)}
                  style={{
                    marginTop: 12,
                    padding: '7px 14px',
                    border: '1px dashed #c8c8c4',
                    borderRadius: 6,
                    background: 'transparent',
                    color: '#6b6b67',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    width: '100%',
                  }}
                >
                  + Add entry
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
