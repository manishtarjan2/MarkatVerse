"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  description?: string;
  subcategory?: string;
  image?: string;
  badge?: string;
  badgeColor?: string;
  isPremium?: boolean;
  isB2B?: boolean;
  moq?: number;
  wholesaleTiers?: { minQty: number, margin: number }[];
  brand?: string;
};

export type Category = {
  id: string;
  name: string;
  theme: string;
  icon: string;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;
  categories: Category[];
  addCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
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
    subcategory: 'Smartphones',
    badge: 'Trending',
    badgeColor: 'badge-purple',
    brand: 'Apple'
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
    subcategory: 'Audio',
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
    subcategory: 'Men',
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
    subcategory: 'Kitchen',
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
    category: 'Home Services',
    subcategory: 'Repair',
    badge: 'Verified Expert',
    badgeColor: 'badge-gold',
    isPremium: true
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
    subcategory: 'Salon',
    badge: 'Trending',
    badgeColor: 'badge-red',
    isPremium: true
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
    category: 'Services',
    subcategory: 'Spa'
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
  },
  {
    id: 'dream-events-weddings',
    name: 'Dream Events & Weddings Planner',
    price: 0,
    originalPrice: 0,
    discount: 'Custom',
    rating: '4.9',
    reviews: '340',
    seller: 'Dream Events Co.',
    location: 'Goa, India',
    category: 'Organizers',
    badge: 'Premium Provider',
    badgeColor: 'badge-gold'
  },
  {
    id: 'prime-construction',
    name: 'Prime Construction & Building Contractors',
    price: 0,
    originalPrice: 0,
    discount: 'Custom',
    rating: '4.7',
    reviews: '125',
    seller: 'Prime Builders Ltd.',
    location: 'Pune, Maharashtra',
    category: 'Organizers',
    badge: 'Certified',
    badgeColor: 'badge-blue'
  },
  {
    id: 'wholesale-clothing-bale',
    name: 'Wholesale Mixed Clothing Bale (100kg)',
    price: 15000,
    originalPrice: 25000,
    discount: '40% OFF',
    rating: '4.7',
    reviews: '89',
    seller: 'Surat Textiles Hub',
    location: 'Surat, Gujarat',
    category: 'B2B',
    badge: 'Global Verified',
    badgeColor: 'badge-purple',
    isB2B: true,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, margin: 20 },
      { minQty: 100, margin: 30 },
      { minQty: 150, margin: 40 }
    ]
  },
  {
    id: 'portland-cement-50kg',
    name: 'UltraTech Premium Portland Cement (50kg Bag)',
    price: 380,
    originalPrice: 420,
    discount: '10% OFF',
    rating: '4.8',
    reviews: '1.2K',
    seller: 'City Builders Mart',
    location: 'Mumbai, Maharashtra',
    category: 'Construction Materials',
    badge: 'Bestseller',
    badgeColor: 'badge-gold',
    isB2B: true,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, margin: 20 },
      { minQty: 100, margin: 30 },
      { minQty: 150, margin: 40 }
    ]
  },
  {
    id: 'tmt-steel-bars',
    name: 'Tata Tiscon 550SD TMT Steel Bars (Per Ton)',
    price: 65000,
    originalPrice: 70000,
    discount: '7% OFF',
    rating: '4.9',
    reviews: '850',
    seller: 'National Steel Traders',
    location: 'Pune, Maharashtra',
    category: 'Construction Materials',
    badge: 'Verified B2B',
    badgeColor: 'badge-gold',
    isB2B: true,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, margin: 20 },
      { minQty: 100, margin: 30 },
      { minQty: 150, margin: 40 }
    ]
  },
  {
    id: 'river-sand-truck',
    name: 'High Quality River Sand (Per Truck Load)',
    price: 18000,
    originalPrice: 20000,
    discount: '10% OFF',
    rating: '4.6',
    reviews: '420',
    seller: 'ABC Aggregates & Sand',
    location: 'Bangalore, Karnataka',
    category: 'Construction Materials',
    badge: 'Trusted',
    badgeColor: 'badge-blue',
    isB2B: true,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, margin: 20 },
      { minQty: 100, margin: 30 },
      { minQty: 150, margin: 40 }
    ]
  },
  {
    id: 'wholesale-cotton-fabric',
    name: 'Premium Cotton Fabric Rolls (Wholesale)',
    price: 150,
    originalPrice: 200,
    discount: '25% OFF',
    rating: '4.8',
    reviews: '56',
    seller: 'Textile Mills Corp',
    location: 'Surat, Gujarat',
    category: 'B2B',
    badge: 'Bulk Order Only',
    badgeColor: 'badge-gold'
  },
  {
    id: 'enterprise-server-rack',
    name: '42U Enterprise Server Rack Cabinet',
    price: 45000,
    originalPrice: 60000,
    discount: '25% OFF',
    rating: '4.9',
    reviews: '34',
    seller: 'TechInfra Solutions',
    location: 'Bangalore, Karnataka',
    category: 'B2B',
    badge: 'Verified B2B',
    badgeColor: 'badge-blue'
  },
  {
    id: 'premium-suv-rental',
    name: 'Premium SUV Self-Drive Rental',
    price: 3500,
    originalPrice: 5000,
    discount: '30% OFF',
    rating: '4.8',
    reviews: '1.2K',
    seller: 'ZoomDrive Rentals',
    location: 'Mumbai, Maharashtra',
    category: 'Rentals',
    badge: 'Top Choice',
    badgeColor: 'badge-gold',
    isPremium: true
  },
  {
    id: 'hr-retainer-service',
    name: 'Corporate HR & Payroll Retainer',
    price: 15000,
    originalPrice: 20000,
    discount: '25% OFF',
    rating: '4.9',
    reviews: '85',
    seller: 'ProStaffing Solutions',
    location: 'Delhi, NCR',
    category: 'Subscriptions',
    badge: 'Enterprise',
    badgeColor: 'badge-blue',
    isPremium: true
  }
];

const defaultCategories: Category[] = [
  { id: 'construction-materials', name: 'Construction Materials', theme: 'amber', icon: '🏗️' },
  { id: 'b2b', name: 'B2B', theme: 'blue', icon: '🚢' },
  { id: 'services', name: 'Services', theme: 'pink', icon: '💆‍♀️' },
  { id: 'home-services', name: 'Home Services', theme: 'emerald', icon: '❄️' },
  { id: 'organizers', name: 'Organizers', theme: 'purple', icon: '🎉' },
  { id: 'transport', name: 'Transport', theme: 'indigo', icon: '🛺' },
  { id: 'electronics', name: 'Electronics', theme: 'slate', icon: '📱' },
  { id: 'fashion', name: 'Fashion', theme: 'pink', icon: '👕' },
  { id: 'home', name: 'Home', theme: 'amber', icon: '🏠' }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [userLocation, setUserLocation] = useState<string>('Mumbai'); // Default mock location

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map backend data format to frontend expected format
          const mappedData = data.map(item => ({
            ...item,
            seller: item.sellerName, // Map DB's sellerName to Context's seller
            category: item.categoryName, // Map DB's categoryName to Context's category
            subcategory: item.subcategory, // Map subcategory if exists
            image: item.image || item.sku || undefined, // Remove hardcoded fallback
            isPremium: false,
            isB2B: item.isB2B,
            moq: item.moq
          }));
          setProducts(mappedData);
        }
      })
      .catch(err => console.error('Failed to load products from API:', err));
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

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    // Simulated backend call
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(console.error);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Send to backend
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'DELETE'
    }).catch(console.error);
  };

  const addCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, userLocation, setUserLocation, categories, addCategory, deleteCategory }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}
