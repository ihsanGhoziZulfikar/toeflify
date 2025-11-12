'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import Footer from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <CustomBreadcrumb />
      {children}
      <Footer />
    </>
  );
}
