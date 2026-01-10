
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const name = searchParams.get('name') || 'User';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin?role=admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, [router, role]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <Sparkles className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary mb-2">
          Welcome, {name}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Redirecting you to your dashboard...
        </p>
      </motion.div>
    </div>
  );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WelcomeContent />
        </Suspense>
    )
}
