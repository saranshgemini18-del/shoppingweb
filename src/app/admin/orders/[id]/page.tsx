

'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Home } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '@/lib/actions';

const orderStatuses: Order['status'][] = [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const fetchedOrder = await getOrderById(id);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      }
      setIsLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return <div>Loading order details...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }
  
  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if(newStatus) {
      await updateOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? {...prev, status: newStatus} : null);
      toast({
        title: "Order Status Updated",
        description: `Order #${order.id.slice(0,8)} has been updated to "${newStatus}".`,
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold font-headline">Order Details</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No items found in this order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home/> Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{order.customerName}</p>
                {order.shippingAddress ? (
                  <>
                    <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Shipping address not available.</p>
                )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard/> Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {order.paymentMethod ? (
                <p>Card ending in: <span className="font-mono">{order.paymentMethod.slice(-4)}</span></p>
              ) : (
                <p>Payment details not available.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order ID: {order.id.slice(0,8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Date</span>
                <span>{format(new Date(order.date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status</span>
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
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                 <Select onValueChange={(newStatus: Order['status']) => handleUpdateStatus(newStatus)} defaultValue={order.status}>
                    <SelectTrigger>
                        <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                        {orderStatuses.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
