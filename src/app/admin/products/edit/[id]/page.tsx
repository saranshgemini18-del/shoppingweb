'use client';
import { ProductForm } from '@/components/admin/product-form';
import type { Product } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getProductById, updateProduct } from '@/lib/actions';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const p = await getProductById(id);
            if (p) {
                setProduct(p);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSave = async (data: Omit<Product, 'id'>) => {
        await updateProduct({ id, ...data });
        toast({
            title: "Product Updated",
            description: `${data.name} has been successfully updated.`,
        });
        router.push('/admin/products?role=admin');
    }
    
    if (!product) {
        return <div>Loading product...</div>
    }

    return (
        <ProductForm product={product} onSave={handleSave} />
    )
}
