
'use client';

import Link from 'next/link';
import { ShoppingCart, Sparkles, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCart } from '@/context/cart-context';
import { Badge } from './ui/badge';
import { useAuth } from '@/context/auth-context';

function CartBadge() {
  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalCartItems <= 0) {
    return null;
  }

  return (
     <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">
        {totalCartItems}
      </Badge>
  )
}

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  const role = searchParams.get('role') || (currentUser?.role.toLowerCase());
  const isAdmin = role === 'admin';

  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === currentUser?.avatarId || 'customer-avatar'
  );
  
  const adminAvatar = PlaceHolderImages.find(
    (img) => img.id === 'admin-avatar-1'
  );

  const navLinks = [
    { href: '/dashboard', label: 'Catalog' },
  ];

  const getHref = (href: string) => {
    return isAdmin ? `${href}?role=admin` : href;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href={getHref("/dashboard")} className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">
              Bharat Bazaar
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getHref(link.href)}
                className={cn(
                  'flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm',
                  pathname.startsWith(link.href) &&
                    (link.href !== '/dashboard' || pathname === '/dashboard')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
             {isAdmin && (
              <Link
                href="/admin?role=admin"
                className={cn(
                  'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                   pathname.startsWith('/admin') ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {!isAdmin && (
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href={getHref("/dashboard/checkout")}>
                  <ShoppingCart className="h-5 w-5" />
                  <CartBadge />
                  <span className="sr-only">Shopping Cart</span>
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {isAuthenticated ? (
                        userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={currentUser?.name || 'User'} data-ai-hint={userAvatar.imageHint} />
                    ) : (
                        <AvatarFallback><User /></AvatarFallback>
                    )}
                    <AvatarFallback>
                      {currentUser?.name.charAt(0) || <User />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isAuthenticated ? currentUser?.name : 'Guest'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isAuthenticated ? currentUser?.email : 'guest@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAdmin && <DropdownMenuItem asChild>
                  <Link href={getHref("/dashboard/my-orders")}>My Orders</Link>
                </DropdownMenuItem>}
                 {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin?role=admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <DropdownMenuItem onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
