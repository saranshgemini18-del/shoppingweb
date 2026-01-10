'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto max-w-2xl py-24 px-4 sm:px-6 lg:px-8">
      <Card className="text-center">
        <CardHeader className="py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <CardTitle className="mt-4 font-headline text-3xl text-primary">
                Thank You For Your Order!
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
            <p className="text-muted-foreground">
                Your order has been successfully placed. You will receive an email confirmation shortly.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                  Order #{orderId.slice(0,8).toUpperCase()}
              </p>
            )}
            <div className="flex justify-center gap-4 pt-4">
                <Button onClick={() => router.push('/dashboard')}>Continue Shopping</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/my-orders')}>
                    View My Orders
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
