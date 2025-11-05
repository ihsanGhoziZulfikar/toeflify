import type { Metadata } from 'next';
import { Geist, Geist_Mono, Rowdies, Saira } from 'next/font/google';
import './globals.css';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export const metadata: Metadata = {
  title: {
    default: 'Toeflify',
    template: '%s | Toeflify',
  },
  description: 'Toeflify — focused TOEFL iBT & ITP preparation: lessons, practice tests, and guided tracks to raise your score.',
  keywords: ['TOEFL', 'TOEFL ITP', 'TOEFL iBT', 'English test prep', 'test preparation', 'TOEFL practice'],
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${rowdies.variable} ${saira.variable} antialiased`}>
        <Navbar />
        <CustomBreadcrumb />
        {children}
        <Footer />
      </body>
    </html>
  );
}
