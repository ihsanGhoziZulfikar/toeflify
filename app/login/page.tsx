import { Suspense } from 'react';
import LoginPageClient from './_components/LoginPageClient';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
