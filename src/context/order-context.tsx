'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Order as OrderType } from '@/lib/data';
import { orders as mockOrders } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';


type OrderContextType = {
  orders: OrderType[];
  addOrder: (order: Omit<OrderType, 'id'>) => OrderType;
  getOrderById: (orderId: string) => OrderType | undefined;
  updateOrderStatus: (orderId: string, status: OrderType['status']) => void;
  isLoading: boolean;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

const getInitialOrders = (): OrderType[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const item = window.localStorage.getItem('orders');
        // If no item in localStorage, initialize with an empty array
        if (item === null) {
            window.localStorage.setItem('orders', JSON.stringify([]));
            return [];
        }
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn(`Error reading localStorage key “orders”:`, error);
        // Fallback to mock data only in case of an error, not for an empty slate.
        return mockOrders;
    }
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOrders(getInitialOrders());
    setIsLoading(false);
  }, []);

  useEffect(() => {
     if (typeof window !== 'undefined' && !isLoading) {
        try {
            window.localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.warn('Error setting localStorage key “orders”:', error);
        }
    }
  }, [orders, isLoading]);
  
  const addOrder = (orderData: Omit<OrderType, 'id'>): OrderType => {
    const newOrder: OrderType = {
      ...orderData,
      id: uuidv4(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };
  
  const getOrderById = (orderId: string) => {
      return orders.find(o => o.id === orderId);
  }

  const updateOrderStatus = (orderId: string, status: OrderType['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const value = {
    orders,
    addOrder,
    getOrderById,
    updateOrderStatus,
    isLoading,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
