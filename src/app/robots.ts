import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/plogin-admin/', '/api/'],
      },
    ],
    sitemap: 'https://articlos.com/sitemap.xml',
  }
}
