import type { Metadata, Viewport } from 'next';

import '@/styles/globals.css';

import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Golden Hour — Find the Perfect Light',
    template: '%s · Golden Hour',
  },
  description:
    'Discover the exact golden hour timings for your location. Sunrise, sunset, blue hour, countdowns, weather and the best nearby photography spots.',
  keywords: [
    'golden hour',
    'sunrise',
    'sunset',
    'blue hour',
    'photography',
    'sun times',
  ],
  openGraph: {
    title: 'Golden Hour — Find the Perfect Light',
    description:
      'Exact golden hour timings, weather and photography spots near you.',
    type: 'website',
    siteName: 'Golden Hour',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfa' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `
try {
  var raw = localStorage.getItem('golden-hour-settings');
  var appearance = raw ? (JSON.parse(raw).state || {}).appearance : null;
  var dark = appearance === 'dark' ||
    ((!appearance || appearance === 'system') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
