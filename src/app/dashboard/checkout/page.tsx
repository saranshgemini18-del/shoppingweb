
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CreditCard, ShoppingCart, Truck, User } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { useOrders } from '@/context/order-context';
import { default as NextImage } from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

function GuestCheckoutPrompt() {
    const router = useRouter();
    return (
        <Card className="text-center py-12">
            <CardHeader>
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4 font-headline text-2xl">Please log in to continue</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">You need to be logged in to place an order.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => router.push('/')}>Log In</Button>
            </CardFooter>
        </Card>
    )
}


export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
        return (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            address.trim() !== '' &&
            city.trim() !== '' &&
            state.trim() !== '' &&
            zip.trim() !== '' &&
            cardNumber.trim() !== ''
        );
    };
    setIsFormValid(validateForm());
  }, [firstName, lastName, address, city, state, zip, cardNumber]);


  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 500.0 : 0;
  const total = subtotal + shipping;
  
  const handlePlaceOrder = () => {
    if(cartItems.length > 0 && currentUser && isFormValid) {
      const newOrderData = {
          customerName: `${firstName} ${lastName}`,
          customerEmail: currentUser.email,
          date: new Date().toISOString(),
          total: total,
          status: 'Pending' as const,
          items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            imageId: item.product.imageId
          })),
          shippingAddress: {
            address,
            city,
            state,
            zip
          },
          paymentMethod: cardNumber
      };

      const newOrder = addOrder(newOrderData);
      
      if (newOrder) {
        clearCart();
        router.push(`/dashboard/order-confirmation?orderId=${newOrder.id}`);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary tracking-tight sm:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Complete your purchase with a few simple steps.
        </p>
      </div>
      
      {!isAuthenticated ? (
         <GuestCheckoutPrompt />
      ) : cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4 font-headline text-2xl">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Truck className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-2xl">
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="sm:col-span-2 grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Palace Road" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Jaipur" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="Rajasthan" value={state} onChange={(e) => setState(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="302001" value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-2xl">
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="**** **** **** 1234" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM/YY" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => {
                const image = PlaceHolderImages.find(
                  (img) => img.id === item.product.imageId
                );
                return (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                      {image && (
                        <NextImage
                          src={image.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
               <Button className="w-full text-lg py-6" onClick={handlePlaceOrder} disabled={!isFormValid || cartItems.length === 0 || !isAuthenticated}>
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
