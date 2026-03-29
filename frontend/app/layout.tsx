import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import { parseThemeCookie } from './lib/theme';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Store Analytics Dashboard',
  description: 'Revenue, funnel, and live commerce events per store',
  icons: {
    icon: [{ url: '/ecom/logo.png', type: 'image/png' }],
    apple: [{ url: '/ecom/logo.png', type: 'image/png' }],
    shortcut: '/ecom/logo.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = parseThemeCookie(cookieStore.get('theme')?.value);

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--swiss-bg)] text-[var(--swiss-fg)] antialiased">{children}</body>
    </html>
  );
}
