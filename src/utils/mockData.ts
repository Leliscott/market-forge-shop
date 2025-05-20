
// Mock data for development

export const mockCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'toys', name: 'Toys & Games' },
  { id: 'sports', name: 'Sports & Outdoors' },
];

export const mockProducts = [
  {
    id: 'product1',
    storeId: 'store1',
    name: 'Premium Wireless Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500',
    description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
    category: 'electronics',
    rating: 4.5,
    stock: 15,
    features: ['Noise cancellation', 'Bluetooth 5.0', '20-hour battery life']
  },
  {
    id: 'product2',
    storeId: 'store1',
    name: 'Smart Watch Series 5',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=500',
    description: 'Latest smartwatch with health monitoring, GPS, and water resistance.',
    category: 'electronics',
    rating: 4.8,
    stock: 8,
    features: ['Heart rate monitoring', 'GPS', 'Water resistant']
  },
  {
    id: 'product3',
    storeId: 'store2',
    name: 'Men\'s Casual Shirt',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500',
    description: 'Comfortable cotton shirt for casual wear.',
    category: 'clothing',
    rating: 4.2,
    stock: 25,
    features: ['100% cotton', 'Machine washable', 'Multiple colors available']
  },
  {
    id: 'product4',
    storeId: 'store2',
    name: 'Women\'s Running Shoes',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500',
    description: 'Lightweight running shoes designed for comfort and performance.',
    category: 'sports',
    rating: 4.7,
    stock: 12,
    features: ['Lightweight', 'Cushioned insole', 'Breathable material']
  },
  {
    id: 'product5',
    storeId: 'store3',
    name: 'Smart Home Security Camera',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1582996031009-f84e781e8616?auto=format&fit=crop&w=500',
    description: 'HD security camera with motion detection and night vision.',
    category: 'electronics',
    rating: 4.4,
    stock: 20,
    features: ['1080p HD', 'Night vision', 'Motion detection']
  },
  {
    id: 'product6',
    storeId: 'store3',
    name: 'Kitchen Blender',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1570222094288-c586a2e0cf2d?auto=format&fit=crop&w=500',
    description: 'Powerful blender for smoothies and food preparation.',
    category: 'home',
    rating: 4.3,
    stock: 18,
    features: ['Multiple speed settings', 'Dishwasher safe', '1000W motor']
  },
  {
    id: 'product7',
    storeId: 'store4',
    name: 'Skin Care Set',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228578-d2efa4aeaf5a?auto=format&fit=crop&w=500',
    description: 'Complete skin care set with cleanser, toner, and moisturizer.',
    category: 'beauty',
    rating: 4.6,
    stock: 22,
    features: ['Organic ingredients', 'For all skin types', 'Paraben-free']
  },
  {
    id: 'product8',
    storeId: 'store4',
    name: 'Smart LED TV - 55"',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=500',
    description: 'Ultra HD smart TV with voice control and streaming apps.',
    category: 'electronics',
    rating: 4.9,
    stock: 5,
    features: ['4K resolution', 'Smart features', 'Voice control']
  }
];

export const mockStores = [
  {
    id: 'store1',
    name: 'TechHub',
    description: 'Your one-stop shop for all tech needs',
    logo: 'https://images.unsplash.com/photo-1580868543941-64e4eff3e00e?auto=format&fit=crop&w=200',
    bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800',
    productCount: 34
  },
  {
    id: 'store2',
    name: 'Fashion Forward',
    description: 'Latest trends in clothing and accessories',
    logo: 'https://images.unsplash.com/photo-1589363460779-bee8065af3cd?auto=format&fit=crop&w=200',
    bannerImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800',
    productCount: 78
  },
  {
    id: 'store3',
    name: 'Home Essentials',
    description: 'Everything you need for your home',
    logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200',
    bannerImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800',
    productCount: 56
  },
  {
    id: 'store4',
    name: 'Wellness World',
    description: 'Beauty and wellness products for everyone',
    logo: 'https://images.unsplash.com/photo-1596382921005-a3004cf5d428?auto=format&fit=crop&w=200',
    bannerImage: 'https://images.unsplash.com/photo-1619214554278-c2bd9e8b3fd8?auto=format&fit=crop&w=800',
    productCount: 42
  }
];

export const mockOrders = [
  {
    id: 'order1',
    customer: { id: '2', name: 'Jane Buyer', email: 'buyer@example.com' },
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        price: mockProducts[0].price
      }
    ],
    total: mockProducts[0].price,
    status: 'processing',
    date: '2023-05-18T10:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Cityville',
      state: 'State',
      zip: '12345',
      country: 'Country'
    }
  },
  {
    id: 'order2',
    customer: { id: '2', name: 'Jane Buyer', email: 'buyer@example.com' },
    items: [
      {
        product: mockProducts[2],
        quantity: 2,
        price: mockProducts[2].price
      },
      {
        product: mockProducts[3],
        quantity: 1,
        price: mockProducts[3].price
      }
    ],
    total: mockProducts[2].price * 2 + mockProducts[3].price,
    status: 'delivered',
    date: '2023-05-15T14:45:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Cityville',
      state: 'State',
      zip: '12345',
      country: 'Country'
    }
  }
];

// Helper function to get products by store ID
export const getProductsByStore = (storeId: string) => {
  return mockProducts.filter(product => product.storeId === storeId);
};

// Helper function to get a store by ID
export const getStoreById = (storeId: string) => {
  return mockStores.find(store => store.id === storeId);
};

// Helper function to get a product by ID
export const getProductById = (productId: string) => {
  return mockProducts.find(product => product.id === productId);
};

// Helper function to get related products (same category)
export const getRelatedProducts = (productId: string, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return mockProducts
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
};
