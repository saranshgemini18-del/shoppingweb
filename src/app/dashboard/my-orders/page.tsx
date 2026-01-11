
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { getMyOrders } from '@/lib/actions';
import type { Order } from '@/lib/data';

export default function MyOrdersPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        setIsLoading(true);
        const myOrders = await getMyOrders();
        setOrders(myOrders);
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchOrders();
    }
  }, [currentUser, isAuthLoading]);

  const pageIsLoading = isLoading || isAuthLoading;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary tracking-tight sm:text-5xl">
          My Orders
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Track your past and present orders.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Your Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pageIsLoading && <p>Loading orders...</p>}
          {!pageIsLoading && orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>

                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium truncate" style={{maxWidth: '100px'}}>
                      {order.id.slice(0,8)}
                    </TableCell>
                    <TableCell>{format(new Date(order.date), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'Delivered'
                            ? 'default'
                            : order.status === 'Cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={cn(
                          order.status === 'Delivered' &&
                            'bg-green-700/80 text-white'
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            !pageIsLoading && <div className="text-center py-8">
                <p className="text-muted-foreground">You have not placed any orders yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
