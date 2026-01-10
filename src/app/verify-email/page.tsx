
'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUsers } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { verifyUser } = useUsers();
  const { toast } = useToast();

  const handleVerification = () => {
    if (email) {
      verifyUser(email);
      toast({
        title: 'Email Verified!',
        description: 'You can now log in to your account.',
      });
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-24 px-4 sm:px-6 lg:px-8">
      <Card className="text-center">
        <CardHeader className="py-8">
            <MailCheck className="mx-auto h-16 w-16 text-primary" />
            <CardTitle className="mt-4 font-headline text-3xl text-primary">
                Verify Your Email Address
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
            <p className="text-muted-foreground">
                An email has been sent to <span className="font-semibold">{email}</span>. Please click the link in the email to verify your account.
            </p>
            <p className="text-sm text-muted-foreground">
                For demonstration purposes, you can click the button below to simulate email verification.
            </p>
            <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handleVerification}>Simulate Email Verification</Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                    Back to Login
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
