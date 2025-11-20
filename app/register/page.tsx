import { Suspense } from 'react';
import RegisterPageClient from './_components/RegisterPageClient';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterPageClient />
    </Suspense>
  );
}
