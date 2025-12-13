

import type { LucideIcon } from 'lucide-react';
import { Gem, Home, Shirt, Glasses } from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  icon?: LucideIcon;
  iconName: string;
};

export const categories: Category[] = [
  { id: 'apparel', name: 'Apparel', iconName: 'Shirt' },
  { id: 'jewelry', name: 'Jewelry', iconName: 'Gem' },
  { id: 'home-decor', name: 'Home Decor', iconName: 'Home' },
  { id: 'spectacles', name: 'Spectacles', iconName: 'Glasses' },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageId: string;
  stock: number;
  imageUrl?: string;
};

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Handcrafted Silk Saree',
    description: 'A beautiful Banarasi silk saree with intricate gold zari work, perfect for weddings and festive occasions.',
    price: 12500,
    categoryId: 'apparel',
    imageId: 'saree',
    stock: 15,
  },
  {
    id: 'prod-2',
    name: 'Embroidered Men\'s Kurta',
    description: 'Elegant linen-cotton blend kurta with fine chikankari embroidery. Comfortable and stylish for any event.',
    price: 6250,
    categoryId: 'apparel',
    imageId: 'kurta',
    stock: 30,
  },
  {
    id: 'prod-3',
    name: 'Gold Jhumka Earrings',
    description: 'Traditional 22k gold plated jhumka earrings with pearl accents. A timeless piece of Indian jewelry.',
    price: 8000,
    categoryId: 'jewelry',
    imageId: 'earrings',
    stock: 25,
  },
  {
    id: 'prod-4',
    name: 'Kundan Necklace Set',
    description: 'Exquisite Kundan choker necklace set with matching earrings, crafted with semi-precious stones.',
    price: 18000,
    categoryId: 'jewelry',
    imageId: 'necklace',
    stock: 10,
  },
  {
    id: 'prod-5',
    name: 'Hand-Painted Terracotta Vases',
    description: 'Set of three terracotta vases, hand-painted with traditional Warli art. A rustic charm for your home.',
    price: 3750,
    categoryId: 'home-decor',
    imageId: 'vase',
    stock: 40,
  },
  {
    id: 'prod-6',
    name: 'Madhubani Art Wall Hanging',
    description: 'Vibrant Madhubani painting on canvas, depicting a traditional folklore scene. Adds a splash of color and culture.',
    price: 5000,
    categoryId: 'home-decor',
    imageId: 'wall-hanging',
    stock: 22,
  },
  {
    id: 'prod-7',
    name: 'Block Print Bed Sheet',
    description: 'Hand block-printed cotton bed sheet from Sanganer, Jaipur. Adds a touch of traditional elegance to your bedroom.',
    price: 4500,
    categoryId: 'home-decor',
    imageId: 'bed-sheet',
    stock: 20,
  },
  {
    id: 'prod-8',
    name: 'Pashmina Shawl',
    description: 'Luxuriously soft and warm Pashmina shawl from Kashmir, with delicate hand-embroidery.',
    price: 25000,
    categoryId: 'apparel',
    imageId: 'shawl',
    stock: 12,
  },
  {
    id: 'prod-9',
    name: 'Silver Anklets (Payal)',
    description: 'A pair of beautifully crafted silver-plated anklets with tiny bells that create a gentle sound.',
    price: 3200,
    categoryId: 'jewelry',
    imageId: 'anklets',
    stock: 35,
  },
  {
    id: 'prod-10',
    name: 'Brass Diya Lamp',
    description: 'An ornate brass Diya (oil lamp) with a peacock design, perfect for your home temple or as a decorative item.',
    price: 2800,
    categoryId: 'home-decor',
    imageId: 'diya-lamp',
    stock: 50,
  },
  {
    id: 'prod-11',
    name: 'Leather Mojari Shoes',
    description: 'Handcrafted traditional Indian leather shoes (Mojari) with intricate thread work for men.',
    price: 4800,
    categoryId: 'apparel',
    imageId: 'mojari-shoes',
    stock: 28,
  },
  {
    id: 'prod-12',
    name: 'Meenakari Bangle Set',
    description: 'A vibrant set of Meenakari (enamel work) bangles, adding a pop of color to any outfit.',
    price: 2500,
    categoryId: 'jewelry',
    imageId: 'bangle-set',
    stock: 45,
  },
  {
    id: 'prod-13',
    name: 'Classic Aviator Spectacles',
    description: 'Timeless aviator frames with a modern twist, suitable for all face shapes. Prescription lenses available.',
    price: 7500,
    categoryId: 'spectacles',
    imageId: 'spectacles',
    stock: 50,
  }
];

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Customer';
  avatarId: string;
  registeredAt: string;
};

export const users: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'Admin', avatarId: 'admin-avatar-1', registeredAt: '2023-01-15' },
    { id: 'user-2', name: 'Customer User', email: 'customer@example.com', password: 'password', role: 'Customer', avatarId: 'customer-avatar', registeredAt: '2023-02-20' },
    { id: 'user-3', name: 'Aarav Patel', email: 'aarav.p@example.com', role: 'Customer', avatarId: 'customer-avatar', registeredAt: '2023-03-05' },
    { id: 'user-4', name: 'Saanvi Gupta', email: 'saanvi.g@example.com', role: 'Customer', avatarId: 'admin-avatar-1', registeredAt: '2023-04-10' },
];

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
    address: string;
    city: string;
    state: string;
    zip: string;
}

export type Order = {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    total: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
};

export const orders: Order[] = [
    { 
        id: 'ord-001', 
        customerName: 'Aarav Patel', 
        customerEmail: 'aarav.p@example.com', 
        date: '2024-05-20', 
        total: 18750, 
        status: 'Delivered', 
        items: [{ productId: 'prod-1', productName: 'Handcrafted Silk Saree', quantity: 1, price: 12500 }, { productId: 'prod-2', productName: 'Embroidered Men\'s Kurta', quantity: 1, price: 6250 }],
        shippingAddress: { address: '123 Palace Road', city: 'Jaipur', state: 'Rajasthan', zip: '302001' },
        paymentMethod: '**** **** **** 1234'
    },
    { 
        id: 'ord-002', 
        customerName: 'Saanvi Gupta', 
        customerEmail: 'saanvi.g@example.com', 
        date: '2024-05-22', 
        total: 8000, 
        status: 'Shipped', 
        items: [{productId: 'prod-3', productName: 'Gold Jhumka Earrings', quantity: 1, price: 8000}],
        shippingAddress: { address: '456 Lake View Apt', city: 'Udaipur', state: 'Rajasthan', zip: '313001' },
        paymentMethod: '**** **** **** 5678'
    },
    { 
        id: 'ord-003', 
        customerName: 'Aarav Patel', 
        customerEmail: 'aarav.p@example.com', 
        date: '2024-05-28', 
        total: 5000, 
        status: 'Pending', 
        items: [{productId: 'prod-6', productName: 'Madhubani Art Wall Hanging', quantity: 1, price: 5000}],
        shippingAddress: { address: '123 Palace Road', city: 'Jaipur', state: 'Rajasthan', zip: '302001' },
        paymentMethod: '**** **** **** 1234'
    },
    { 
        id: 'ord-004', 
        customerName: 'Saanvi Gupta', 
        customerEmail: 'saanvi.g@example.com', 
        date: '2024-06-01', 
        total: 3750, 
        status: 'Pending', 
        items: [{productId: 'prod-5', productName: 'Hand-Painted Terracotta Vases', quantity: 1, price: 3750}],
        shippingAddress: { address: '456 Lake View Apt', city: 'Udaipur', state: 'Rajasthan', zip: '313001' },
        paymentMethod: '**** **** **** 5678'
    },
    { 
        id: 'ord-005', 
        customerName: 'Rohan Mehta', 
        customerEmail: 'rohan.mehta@example.com', 
        date: '2024-06-02', 
        total: 12500, 
        status: 'Cancelled', 
        items: [{productId: 'prod-1', productName: 'Handcrafted Silk Saree', quantity: 1, price: 12500}],
        shippingAddress: { address: '789 Desert Trail', city: 'Jodhpur', state: 'Rajasthan', zip: '342001' },
        paymentMethod: '**** **** **** 9012'
    },
]
