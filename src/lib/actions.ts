'use server';

import { revalidatePath } from 'next/cache';
import { products as mockProducts, orders as mockOrders, users as mockUsers } from './data';
import type { Product, Order, User, ShippingAddress } from './data';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// In a real app, you'd use a database. For this demo, we'll use a server-side cache
// that mimics a database, initialized with mock data.
let products: Product[] = [...mockProducts];
let orders: Order[] = [...mockOrders];
let users: User[] = [...mockUsers];

type Cart = {
    [productId: string]: number;
}
// Carts will be stored per user session
let carts: { [sessionId: string]: Cart } = {};


// --- SESSION MANAGEMENT ---
function getSessionId() {
    const cookieStore = cookies();
    let sessionId = cookieStore.get('sessionId')?.value;
    if (!sessionId) {
        sessionId = uuidv4();
        cookieStore.set('sessionId', sessionId, { httpOnly: true, secure: true });
    }
    return sessionId;
}

function getCart() {
    const sessionId = getSessionId();
    if (!carts[sessionId]) {
        carts[sessionId] = {};
    }
    return carts[sessionId];
}

// --- PRODUCT ACTIONS ---

export async function getProducts(): Promise<Product[]> {
    return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    return products.find(p => p.id === id);
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: uuidv4(),
    };
    products.unshift(newProduct);
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
    return newProduct;
}

export async function updateProduct(updatedProduct: Product): Promise<void> {
    products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${updatedProduct.id}`);
    revalidatePath('/dashboard');
}

export async function deleteProduct(productId: string): Promise<void> {
    products = products.filter(p => p.id !== productId);
    revalidatePath('/admin/products');
    revalidatePath('/dashboard');
}

// --- ORDER ACTIONS ---

export async function getOrders(): Promise<Order[]> {
    // In a real app, you would check if the user is an admin here
    return orders;
}

export async function getMyOrders(): Promise<Order[]> {
    // This needs a user context, which we'll simulate.
    // For now, returning orders for a hardcoded user.
    const currentUserEmail = 'customer@example.com';
    return orders.filter(o => o.customerEmail === currentUserEmail);
}


export async function getOrderById(orderId: string): Promise<Order | undefined> {
     // In a real app, you would check for admin or ownership here
    return orders.find(o => o.id === orderId);
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    // In a real app, you would check if the user is an admin here
    orders = orders.map(o => (o.id === orderId ? { ...o, status } : o));
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
}

// --- CART ACTIONS ---
export type CartItem = {
  product: Product;
  quantity: number;
};

export async function getCartItems(): Promise<CartItem[]> {
    const cart = getCart();
    const cartItems: CartItem[] = [];
    for (const productId in cart) {
        const product = await getProductById(productId);
        if (product) {
            cartItems.push({ product, quantity: cart[productId] });
        }
    }
    return cartItems;
}

export async function getCartItemCount(): Promise<number> {
    const cart = getCart();
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export async function addToCart(productId: string): Promise<void> {
    const cart = getCart();
    cart[productId] = (cart[productId] || 0) + 1;
    revalidatePath('/dashboard/checkout');
    revalidatePath('/dashboard'); // For updating cart badge in header
}

export async function clearCart(): Promise<void> {
    const sessionId = getSessionId();
    carts[sessionId] = {};
    revalidatePath('/dashboard/checkout');
}


// --- CHECKOUT ACTION ---
type PlaceOrderInput = {
    customerName: string;
    customerEmail: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
}

export async function placeOrder(orderData: PlaceOrderInput): Promise<Order> {
    const cartItems = await getCartItems();
    if (cartItems.length === 0) {
        throw new Error("Cart is empty");
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = 500.0;
    const total = subtotal + shipping;

    const newOrder: Order = {
        id: uuidv4(),
        date: new Date().toISOString(),
        status: 'Pending',
        total,
        ...orderData,
        items: cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            imageId: item.product.imageId
        })),
    };

    orders.unshift(newOrder);
    await clearCart();
    
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders');
    
    return newOrder;
}
