import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://soravio.com',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/about',
      lastModified: new Date(),
    },
    {
      'url': 'https://soravio.com/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/plans',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/plans/ne',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/how-it-works',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/faq',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/auth/sign-in',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/auth/sign-up',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/auth/forgot-password',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/dashboard',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/dashboard/orders',
      lastModified: new Date(),
    },
    {
      url: 'https://soravio.com/checkout',
      lastModified: new Date(),
    },
  ]
}
