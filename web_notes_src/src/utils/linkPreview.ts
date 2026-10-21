export interface LinkPreviewData {
  url: string
  domain: string
  title: string
}

export function extractUrls(text: string): string[] {
  if (!text) return []
  // Match real http and https URLs only
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi
  const matches = text.match(urlRegex)
  return matches ? Array.from(new Set(matches)) : []
}

export function parseLinkPreviewFromText(text: string): LinkPreviewData | null {
  if (!text) return null
  const urls = extractUrls(text)
  if (urls.length === 0) return null

  const firstUrl = urls[0]
  try {
    const parsed = new URL(firstUrl)
    // Only accept valid http/https
    if (!parsed.protocol.startsWith('http')) return null

    const domain = parsed.hostname.replace(/^www\./, '')
    let title = domain

    // Domain friendly names
    if (domain.includes('github.com')) title = 'GitHub'
    else if (domain.includes('youtube.com') || domain.includes('youtu.be')) title = 'YouTube'
    else if (domain.includes('wikipedia.org')) title = 'Wikipedia'
    else if (domain.includes('twitter.com') || domain.includes('x.com')) title = 'X (Twitter)'
    else if (domain.includes('medium.com')) title = 'Medium'
    else if (domain.includes('docs.google.com')) title = 'Google Docs'
    else if (parsed.pathname && parsed.pathname.length > 1) {
      const slug = parsed.pathname.split('/').filter(Boolean).pop()
      if (slug) {
        const cleaned = slug.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').trim()
        if (cleaned.length > 0 && cleaned.length < 50) {
          title = `${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)} • ${domain}`
        }
      }
    }

    return {
      url: firstUrl,
      domain,
      title,
    }
  } catch (e) {
    return null
  }
}

export function parseLinkPreview(url: string): LinkPreviewData | null {
  return parseLinkPreviewFromText(url)
}
