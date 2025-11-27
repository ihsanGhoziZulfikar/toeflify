import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Rowdies,
  Saira,
  Open_Sans,
  Outfit,
} from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const rowdies = Rowdies({
  variable: '--font-rowdies',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const saira = Saira({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-saira',
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: 'Toeflify',
    template: '%s | Toeflify',
  },
  description:
    'Toeflify — focused TOEFL iBT & ITP preparation: lessons, practice tests, and guided tracks to raise your score.',
  keywords: [
    'TOEFL',
    'TOEFL ITP',
    'TOEFL iBT',
    'English test prep',
    'test preparation',
    'TOEFL practice',
  ],
  creator: 'Toeflify',
  authors: [{ name: 'Toeflify' }],
  icons: {
    icon: '/assets/images/logo.svg',
    shortcut: '/assets/images/logo.svg',
    apple: '/assets/images/logo.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          rowdies.variable,
          saira.variable,
          openSans.variable,
          outfit.variable,
          'antialiased',
        ].join(' ')}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
