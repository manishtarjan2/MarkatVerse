"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  seller: string;
  sellerId?: string;
  location: string;
  primaryType?: 'PRODUCT' | 'SERVICE' | 'VEHICLE';
  category: string;
  subcategory?: string;
  nestedSubcategory?: string;
  description?: string;
  image?: string;
  images?: string[];
  badge?: string;
  badgeColor?: string;
  isPremium?: boolean;
  isB2B?: boolean;
  moq?: number;
  wholesaleTiers?: { minQty: number, margin: number }[];
  brand?: string;
  parameters?: Record<string, string | string[]>;
};

export type FormField = {
  name: string;
  type: 'radio' | 'checkbox' | 'text' | 'number';
  options?: string[];
  placeholder?: string;
};

export type NestedSubcategory = {
  name: string;
  parameters: FormField[];
};

export type Subcategory = {
  name: string;
  nestedSubcategories?: NestedSubcategory[];
  parameters?: FormField[];
};

export type ListingType = 'Product' | 'Service' | 'Vehicle';
export type BusinessModel = 'B2C' | 'B2B' | 'Appointment' | 'RFQ' | 'Bulk Pricing' | 'MOQ' | 'Quote' | 'Token' | 'Meeting' | 'Sample';
export type FeatureRule = 'Product Stock' | 'Service' | 'Appointment' | 'Token' | 'RFQ' | 'B2C' | 'B2B' | 'Bulk Pricing' | 'MOQ' | 'Quote' | 'Meeting' | 'Sample' | 'Vehicle Test Drive';

export type Category = {
  id: string;
  primaryType: 'PRODUCT' | 'SERVICE' | 'VEHICLE';
  name: string;
  theme: string;
  icon: string;
  subcategories?: Subcategory[];
  parameters?: FormField[];
  // ── Relationship Manager fields ──
  allowedListingTypes?: ListingType[];
  businessModels?: BusinessModel[];
  workflow?: string;
  allowedFeatures?: FeatureRule[];
  notApplicable?: FeatureRule[];
  optionalFeatures?: FeatureRule[];
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  editProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  userLocation: string;
  setUserLocation: (location: string) => void;
  categories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
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
    brand: 'Apple',
    parameters: {
      'Color': ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      'Storage': ['256GB', '512GB', '1TB']
    }
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
    badgeColor: 'badge-red',
    parameters: {
      'Color': ['Active Black', 'Cyan Cider']
    }
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
    badgeColor: 'badge-red',
    parameters: {
      'Color': ['White', 'Navy Blue', 'Olive Green', 'Maroon'],
      'Size': ['S', 'M', 'L', 'XL', 'XXL'],
      'Fabric': ['Cotton', 'Linen Blend']
    }
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
    badgeColor: 'badge-gold',
    parameters: {
      'Color': ['Silver', 'Black']
    }
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
  // ── PRODUCT ──
  {
    id: 'c1',
    primaryType: 'PRODUCT',
    name: 'Electronics',
    theme: 'bg-blue-50 text-blue-600',
    icon: 'MonitorSmartphone',
    allowedListingTypes: ['Product'],
    businessModels: ['B2C', 'B2B'],
    workflow: 'Product Sales Workflow',
    allowedFeatures: ['Product Stock', 'B2C', 'B2B'],
    notApplicable: ['Service', 'Appointment', 'Token', 'Vehicle Test Drive'],
    optionalFeatures: ['RFQ', 'Bulk Pricing'],
    subcategories: [
      {
        name: 'Mobile',
        nestedSubcategories: [
          {
            name: 'Smartphone',
            parameters: [
              { name: 'RAM', type: 'radio', options: ['4 GB', '6 GB', '8 GB', '12 GB'] },
              { name: 'Storage', type: 'radio', options: ['64 GB', '128 GB', '256 GB', '512 GB'] },
              { name: 'Color', type: 'checkbox', options: ['Black', 'White', 'Blue', 'Green'] },
              { name: 'Warranty', type: 'text', placeholder: 'e.g. 1 Year Manufacturer Warranty' }
            ]
          },
          {
            name: 'Feature Phone',
            parameters: [
              { name: 'Color', type: 'checkbox', options: ['Black', 'Blue', 'Red'] },
              { name: 'Battery', type: 'radio', options: ['1000 mAh', '2000 mAh', '3000 mAh'] }
            ]
          }
        ]
      },
      { name: 'Laptop' },
      { name: 'TV' },
      { name: 'Camera' }
    ]
  },
  {
    id: 'c2',
    primaryType: 'PRODUCT',
    name: 'Construction',
    theme: 'bg-amber-50 text-amber-600',
    icon: 'HardHat',
    allowedListingTypes: ['Product'],
    businessModels: ['B2B', 'B2C', 'Bulk Pricing', 'MOQ', 'RFQ', 'Quote'],
    workflow: 'B2B / Manufacturer Workflow',
    allowedFeatures: ['Product Stock', 'B2B', 'B2C', 'RFQ', 'Bulk Pricing', 'MOQ', 'Quote'],
    notApplicable: ['Service', 'Appointment', 'Token', 'Vehicle Test Drive'],
    optionalFeatures: ['Meeting', 'Sample'],
    subcategories: [
      { name: 'Cement', parameters: [{ name: 'Grade', type: 'radio', options: ['43 Grade', '53 Grade', 'PPC'] }] },
      { name: 'Steel', parameters: [{ name: 'Type', type: 'radio', options: ['TMT Bars', 'Structural', 'Sheets'] }] },
      { name: 'Tiles' },
      { name: 'Pipes' }
    ]
  },
  {
    id: 'c3',
    primaryType: 'PRODUCT',
    name: 'Agriculture',
    theme: 'bg-lime-50 text-lime-600',
    icon: 'Leaf',
    allowedListingTypes: ['Product'],
    businessModels: ['B2C', 'B2B', 'Bulk Pricing', 'MOQ'],
    workflow: 'Product Sales Workflow',
    allowedFeatures: ['Product Stock', 'B2C', 'B2B', 'Bulk Pricing', 'MOQ'],
    notApplicable: ['Service', 'Appointment', 'Token', 'Vehicle Test Drive'],
    optionalFeatures: ['RFQ', 'Sample'],
    subcategories: [
      { name: 'Seeds' },
      { name: 'Fertilizer' },
      { name: 'Machinery' },
      { name: 'Irrigation' }
    ]
  },

  // ── SERVICE ──
  {
    id: 's1',
    primaryType: 'SERVICE',
    name: 'Beauty',
    theme: 'bg-pink-50 text-pink-600',
    icon: 'Scissors',
    allowedListingTypes: ['Service'],
    businessModels: ['B2C', 'Appointment', 'Token'],
    workflow: 'Salon Booking Workflow',
    allowedFeatures: ['Service', 'Appointment', 'Token', 'B2C'],
    notApplicable: ['Product Stock', 'Vehicle Test Drive', 'RFQ', 'B2B'],
    optionalFeatures: ['Meeting'],
    subcategories: [
      { name: 'Salon', parameters: [{ name: 'Service Type', type: 'checkbox', options: ['Haircut', 'Coloring', 'Styling'] }] },
      { name: 'Spa' },
      { name: 'Beauty Parlour' }
    ]
  },
  {
    id: 's2',
    primaryType: 'SERVICE',
    name: 'Healthcare',
    theme: 'bg-emerald-50 text-emerald-600',
    icon: 'Stethoscope',
    allowedListingTypes: ['Service'],
    businessModels: ['B2C', 'Appointment', 'Token'],
    workflow: 'Doctor / Queue Workflow',
    allowedFeatures: ['Service', 'Appointment', 'Token', 'B2C'],
    notApplicable: ['Product Stock', 'Vehicle Test Drive', 'RFQ', 'Bulk Pricing', 'B2B'],
    optionalFeatures: ['Meeting'],
    subcategories: [
      { name: 'Doctor', parameters: [{ name: 'Specialization', type: 'text', placeholder: 'e.g. Cardiologist' }, { name: 'Consultation', type: 'radio', options: ['In-Clinic', 'Online'] }] },
      { name: 'Dentist' },
      { name: 'Physiotherapy' }
    ]
  },
  {
    id: 's3',
    primaryType: 'SERVICE',
    name: 'Home',
    theme: 'bg-teal-50 text-teal-600',
    icon: 'Wrench',
    allowedListingTypes: ['Service'],
    businessModels: ['B2C', 'RFQ', 'Quote'],
    workflow: 'Home Services Workflow',
    allowedFeatures: ['Service', 'B2C', 'RFQ', 'Quote'],
    notApplicable: ['Product Stock', 'Vehicle Test Drive', 'Token', 'B2B', 'MOQ'],
    optionalFeatures: ['Appointment', 'Meeting'],
    subcategories: [
      { name: 'Electrician' },
      { name: 'Plumber' },
      { name: 'Carpenter' }
    ]
  },
  {
    id: 's4',
    primaryType: 'SERVICE',
    name: 'Professional',
    theme: 'bg-indigo-50 text-indigo-600',
    icon: 'Briefcase',
    allowedListingTypes: ['Service'],
    businessModels: ['B2C', 'B2B', 'Quote', 'Meeting'],
    workflow: 'Meeting / Proposal Workflow',
    allowedFeatures: ['Service', 'B2C', 'B2B', 'Quote', 'Meeting'],
    notApplicable: ['Product Stock', 'Vehicle Test Drive', 'Token', 'MOQ', 'Bulk Pricing'],
    optionalFeatures: ['RFQ', 'Appointment'],
    subcategories: [
      { name: 'Consultant', parameters: [{ name: 'Field', type: 'text', placeholder: 'e.g. IT, Management' }] },
      { name: 'Lawyer' },
      { name: 'Accountant' }
    ]
  },

  // ── VEHICLE ──
  {
    id: 'v1',
    primaryType: 'VEHICLE',
    name: 'Sales & Rentals',
    theme: 'bg-red-50 text-red-600',
    icon: 'Car',
    allowedListingTypes: ['Vehicle'],
    businessModels: ['B2C', 'RFQ', 'Quote'],
    workflow: 'Vehicle Enquiry / Asset Workflow',
    allowedFeatures: ['Vehicle Test Drive', 'B2C', 'RFQ', 'Quote'],
    notApplicable: ['Product Stock', 'Service', 'Token', 'B2B', 'Bulk Pricing', 'MOQ'],
    optionalFeatures: ['Meeting', 'Appointment'],
    subcategories: [
      { name: 'Car', parameters: [{ name: 'Fuel Type', type: 'radio', options: ['Petrol', 'Diesel', 'EV', 'Hybrid'] }, { name: 'Transmission', type: 'radio', options: ['Manual', 'Automatic'] }] },
      { name: 'Bike' },
      { name: 'Truck' },
      { name: 'Bus' },
      { name: 'Tractor' },
      { name: 'Construction Vehicle' }
    ]
  }
];

import { useAuth } from './AuthContext';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [userLocation, setUserLocation] = useState<string>('Mumbai'); // Default mock location

  useEffect(() => {
    console.log('Fetching products from:', `${API_URL}/products`);
    fetch(`${API_URL}/products`)
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
            images: item.images || (item.image ? [item.image] : []),
            isPremium: false,
            isB2B: item.isB2B,
            moq: item.moq
          }));
          
          // Bind default mock products to the logged-in user so they can test their dashboard
          const userLinkedDefaults = defaultProducts.map(p => ({
            ...p,
            sellerId: user && user.role !== 'buyer' ? user.id : p.sellerId,
            seller: user && user.role !== 'buyer' ? (user.business?.name || user.name || p.seller) : p.seller
          }));
          setProducts([...mappedData, ...userLinkedDefaults]);
        } else {
          // Bind default mock products to the logged-in user
          const userLinkedDefaults = defaultProducts.map(p => ({
            ...p,
            sellerId: user && user.role !== 'buyer' ? user.id : p.sellerId,
            seller: user && user.role !== 'buyer' ? (user.business?.name || user.name || p.seller) : p.seller
          }));
          setProducts(userLinkedDefaults);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        // Bind default mock products to the logged-in user
        const userLinkedDefaults = defaultProducts.map(p => ({
          ...p,
          sellerId: user && user.role !== 'buyer' ? user.id : p.sellerId,
          seller: user && user.role !== 'buyer' ? (user.business?.name || user.name || p.seller) : p.seller
        }));
        setProducts(userLinkedDefaults);
      });
  }, [user?.id]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
      
      // Map returned db entity format back to context format if needed, 
      // though the backend mapProduct seems to handle it nicely
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const editProduct = async (id: string, updated: Partial<Product>) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Failed to edit product');
      const updatedProduct = await res.json();
      
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');
      
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, userLocation, setUserLocation, categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}

export function useCategoryRules(categoryName: string | undefined) {
  const { categories } = useProducts();
  const cat = categories.find(c => c.name === categoryName);
  const allowedFeatures  = cat?.allowedFeatures  ?? [];
  const notApplicable    = cat?.notApplicable     ?? [];
  const optionalFeatures = cat?.optionalFeatures  ?? [];
  return {
    cat,
    allowedFeatures,
    notApplicable,
    optionalFeatures,
    businessModels: (cat?.businessModels ?? []) as BusinessModel[],
    workflow: cat?.workflow ?? '',
    allows:     (f: FeatureRule) => allowedFeatures.includes(f),
    isOptional: (f: FeatureRule) => optionalFeatures.includes(f),
    isBlocked:  (f: FeatureRule) => notApplicable.includes(f),
  };
}
