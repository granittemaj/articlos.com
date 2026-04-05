export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function readingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function extractToc(html: string): { id: string; level: number; text: string }[] {
  const toc: { id: string; level: number; text: string }[] = []
  const seen: Record<string, number> = {}
  const regex = /<h([23])[^>]*>([\s\S]*?)<\/h[23]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (seen[id]) { seen[id]++; id = `${id}-${seen[id]}` } else { seen[id] = 1 }
    toc.push({ id, level, text })
  }
  return toc
}

export function injectHeadingIds(html: string): string {
  const seen: Record<string, number> = {}
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h([23])>/gi, (_match, openLevel, attrs, content, _closeLevel) => {
    const text = content.replace(/<[^>]*>/g, '').trim()
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (seen[id]) { seen[id]++; id = `${id}-${seen[id]}` } else { seen[id] = 1 }
    return `<h${openLevel}${attrs} id="${id}">${content}</h${openLevel}>`
  })
}
