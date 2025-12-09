import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/configs/firebase-admin';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smscone.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '/',
    '/explore',
    '/movies',
    '/series',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
  }));

  try {
    // Fetch custom movies
    const moviesSnapshot = await adminDb.collection('customMovies').get();
    const movieRoutes = moviesSnapshot.docs.map((doc) => ({
      url: `${APP_URL}/movies/custom_${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate() || new Date(),
    }));

    // Fetch custom series
    const seriesSnapshot = await adminDb.collection('customSeries').get();
    const seriesRoutes = seriesSnapshot.docs.map((doc) => ({
      url: `${APP_URL}/series/custom_${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate() || new Date(),
    }));

    return [...staticRoutes, ...movieRoutes, ...seriesRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
