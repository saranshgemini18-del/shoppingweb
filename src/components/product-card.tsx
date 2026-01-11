'use client';

import Image from 'next/image';
import type { Product } from '@/lib/data';
import { categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { addToCart } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const category = categories.find(c => c.id === product.categoryId);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === product.imageId);

  const imageUrl = product.imageUrl || placeholderImage?.imageUrl;
  const imageHint = placeholderImage?.imageHint || 'product image';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Please Log In',
        description: 'You must be logged in to add items to the cart.',
      });
      router.push('/');
      return;
    }
    try {
      await addToCart(product.id);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add item to cart.',
      });
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="p-0">
        {imageUrl && (
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              width={600}
              height={450}
              data-ai-hint={imageHint}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4 flex-grow flex flex-col">
        {category && (
          <Badge variant="outline" className="mb-2 border-accent text-accent w-fit">
            {category.name}
          </Badge>
        )}
        <CardTitle className="font-headline text-xl mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm flex-grow">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <p className="text-lg font-semibold text-primary">
          ₹{product.price.toFixed(2)}
        </p>
        <Button onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
