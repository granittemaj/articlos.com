import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'articlos — AI Article Generator for SEO'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f0e',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'auto' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 11,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f0f0e',
              fontWeight: 800,
              fontSize: 26,
            }}
          >
            a
          </div>
          <span style={{ color: '#ffffff', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em' }}>
            articlos
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              maxWidth: 900,
            }}
          >
            The content intelligence system that never stops.
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 680,
            }}
          >
            AI-powered article generation for content teams that want to rank.
          </div>
        </div>

        {/* Bottom pill */}
        <div style={{ display: 'flex', marginTop: 52 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500 }}>
              articlos.com
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
