'use client'

import { useEffect } from 'react'

const GA_ID = 'G-6L4N2Q05PW'

function loadGA() {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.gaLoaded) return
  w.gaLoaded = true

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]) {
    w.dataLayer.push(args)
  }
  w.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (localStorage.getItem('articlos_consent') === 'accepted') {
      loadGA()
    }

    function onConsentAccepted() {
      loadGA()
    }
    window.addEventListener('articlos_consent_accepted', onConsentAccepted)
    return () => window.removeEventListener('articlos_consent_accepted', onConsentAccepted)
  }, [])

  return null
}
