'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { isAuthenticated } from '@/lib/auth';
import { Dumbbell } from 'lucide-react';

export default function LoginPage() {
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

        {/* Login Form */}
        <LoginForm />

        {/* Footer Text */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-accent hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
