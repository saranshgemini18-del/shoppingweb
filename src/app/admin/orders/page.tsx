'use client'
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
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getOrders } from '@/lib/actions';
import type { Order } from '@/lib/data';


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const getAdminLink = (path: string) => `${path}?role=admin`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">All Customer Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading orders...</p> : (
          orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} onClick={() => router.push(getAdminLink(`/admin/orders/${order.id}`))} className="cursor-pointer">
                    <TableCell className="font-medium truncate" style={{maxWidth: '100px'}}>{order.id.slice(0,8)}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
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
                          order.status === 'Delivered' && 'bg-green-700/80 text-white'
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                     <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={getAdminLink(`/admin/orders/${order.id}`)}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders have been placed yet.</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
