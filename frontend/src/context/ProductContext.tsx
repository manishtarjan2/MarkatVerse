"use client";
import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  seller: string;
  location: string;
  category: string;
  image?: string;
  badge?: string;
  badgeColor?: string;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
};

const defaultProducts: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max 256GB',
    price: 134900,
    originalPrice: 159900,
    discount: '15% OFF',
    rating: '4.8',
    reviews: '12.5K',
    seller: 'Apple Authorized India',
    location: 'Mumbai, Maharashtra',
    category: 'Electronics',
    badge: 'Bestseller',
    badgeColor: 'badge-gold'
  },
  {
    id: 'boat-airdopes-141',
    name: 'boAt Airdopes 141 Bluetooth Earbuds',
    price: 1299,
    originalPrice: 2999,
    discount: '57% OFF',
    rating: '4.6',
    reviews: '8.4K',
    seller: 'Appario Retail',
    location: 'Bengaluru, Karnataka',
    category: 'Electronics',
    badge: 'Deal of the Day',
    badgeColor: 'badge-red'
  },
  {
    id: 'mens-casual-shirt',
    name: "Men's Casual Cotton Shirt",
    price: 699,
    originalPrice: 1499,
    discount: '53% OFF',
    rating: '4.3',
    reviews: '2.1K',
    seller: 'Fashion Hub',
    location: 'Surat, Gujarat',
    category: 'Fashion',
    badge: 'Trending',
    badgeColor: 'badge-red'
  },
  {
    id: 'kitchen-appliance-set',
    name: 'Kitchen Appliance Set (5 Pieces)',
    price: 2499,
    originalPrice: 4999,
    discount: '50% OFF',
    rating: '4.7',
    reviews: '3.6K',
    seller: 'Home Essentials Ltd',
    location: 'New Delhi, Delhi',
    category: 'Home',
    badge: 'Top Rated',
    badgeColor: 'badge-gold'
  },
  {
    id: 'ac-repair-service',
    name: 'Professional AC Repair & Servicing',
    price: 499,
    originalPrice: 999,
    discount: '50% OFF',
    rating: '4.9',
    reviews: '1.2K',
    seller: 'Urban Cool Services',
    location: 'Mumbai, Maharashtra',
    category: 'Services',
    badge: 'Verified Expert',
    badgeColor: 'badge-gold'
  },
  {
    id: 'hair-cutting-styling',
    name: 'Men & Women Hair Cutting & Styling',
    price: 299,
    originalPrice: 599,
    discount: '50% OFF',
    rating: '4.8',
    reviews: '3.4K',
    seller: 'Elite Salon & Spa',
    location: 'Mumbai, Maharashtra',
    category: 'Services',
    badge: 'Trending',
    badgeColor: 'badge-red'
  },
  {
    id: 'premium-pedicure',
    name: 'Premium Spa Pedicure & Manicure',
    price: 899,
    originalPrice: 1500,
    discount: '40% OFF',
    rating: '4.9',
    reviews: '890',
    seller: 'Elite Salon & Spa',
    location: 'Mumbai, Maharashtra',
    category: 'Services'
  },
  {
    id: 'nail-art-extensions',
    name: 'Nail Cutting, Art & Gel Extensions',
    price: 1200,
    originalPrice: 2000,
    discount: '40% OFF',
    rating: '4.7',
    reviews: '450',
    seller: 'Glamour Nails Studio',
    location: 'Delhi, NCR',
    category: 'Services',
    badge: 'Highly Rated',
    badgeColor: 'badge-gold'
  },
  {
    id: 'city-auto-rentals',
    name: 'City Auto Rentals & Local Transport',
    price: 12,
    originalPrice: 15,
    discount: '20% OFF',
    rating: '4.6',
    reviews: '2.3K',
    seller: 'QuickRide Autos',
    location: 'Bangalore, Karnataka',
    category: 'Transport',
    badge: 'Trusted',
    badgeColor: 'badge-blue'
  },
  {
    id: 'heavy-freight-movers',
    name: 'Heavy Freight Trucking & Cargo Movers',
    price: 45,
    originalPrice: 60,
    discount: '25% OFF',
    rating: '4.9',
    reviews: '8.1K',
    seller: 'National Logistics Co.',
    location: 'Mumbai, Maharashtra',
    category: 'Transport',
    badge: 'Verified B2B',
    badgeColor: 'badge-gold'
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  React.useEffect(() => {
    // Fetch products from API on load
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch products from API, using fallback", err);
      });
  }, []);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    // Send to backend
    fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).catch(console.error);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Send to backend
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'DELETE'
    }).catch(console.error);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}
