import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Veyro - On-Demand Real Estate Services',
    short_name: 'Veyro',
    description: 'Book verified agents for showings, tours, and consultations. No commissions, no contracts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F7F5',
    theme_color: '#39FF14',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
