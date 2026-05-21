'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { isAuthenticated } from '@/lib/auth';
import { Dumbbell } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Dumbbell className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-foreground">FitHub</span>
        </Link>

        {/* Forgot Password Form */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
