import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

import { ThemeProvider } from '@/components/theme-provider';

const switzer = localFont({
  variable: '--font-switzer',
  display: 'swap',
  preload: true,
  src: [
    { path: './fonts/switzer-200.woff2', weight: '200' },
    { path: './fonts/switzer-300.woff2', weight: '300' },
    { path: './fonts/switzer-400.woff2', weight: '400' },
    { path: './fonts/switzer-500.woff2', weight: '500' },
    { path: './fonts/switzer-600.woff2', weight: '600' },
  ],
});

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
      <body className={`${switzer.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
