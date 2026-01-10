import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ChatWidget } from '@/components/chat-widget';
import { CartProvider } from '@/context/cart-context';
import { OrderProvider } from '@/context/order-context';
import { ProductProvider } from '@/context/product-context';
import { Suspense } from 'react';

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <ChatWidget />
        <SiteFooter />
      </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductProvider>
      <OrderProvider>
        <CartProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
          </Suspense>
        </CartProvider>
      </OrderProvider>
    </ProductProvider>
  );
}
