'use client';
import { ProductForm } from '@/components/admin/product-form';
import type { Product } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/actions';

export default function NewProductPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSave = async (data: Omit<Product, 'id'>) => {
        await addProduct(data);
        toast({
            title: "Product Created",
            description: `${data.name} has been successfully added.`,
        });
        router.push('/admin/products?role=admin');
    }

    return (
        <ProductForm onSave={handleSave} />
    )
}
