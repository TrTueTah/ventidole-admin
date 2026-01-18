import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Next.js SignIn Page | Ventidole - Next.js Dashboard Template',
  description: 'This is Next.js Signin Page Ventidole Dashboard Template',
};

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
