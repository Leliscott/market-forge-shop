
// Helper functions for data manipulation

// Helper function to get products by store ID
export const getProductsByStore = (storeId: string, products: any[]) => {
  return products.filter(product => product.storeId === storeId);
};

// Helper function to get a store by ID
export const getStoreById = (storeId: string, stores: any[]) => {
  return stores.find(store => store.id === storeId);
};

// Helper function to get a product by ID
export const getProductById = (productId: string, products: any[]) => {
  return products.find(product => product.id === productId);
};

// Helper function to get related products (same category)
export const getRelatedProducts = (productId: string, products: any[], limit = 4) => {
  const product = getProductById(productId, products);
  if (!product) return [];
  
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
};

// Product categories (to be used in forms)
export const productCategories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books',
  'Automotive',
  'Jewelry',
  'Food & Beverages',
  'Office Supplies',
  'Health & Wellness',
  'Art & Crafts',
  'Pet Supplies',
  'Music & Instruments',
  'Other'
];

// Mock categories data for the home page
export const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    icon: '📱',
    count: 150
  },
  {
    id: '2',
    name: 'Clothing',
    icon: '👕',
    count: 200
  },
  {
    id: '3',
    name: 'Home & Garden',
    icon: '🏠',
    count: 120
  },
  {
    id: '4',
    name: 'Beauty & Personal Care',
    icon: '💄',
    count: 80
  },
  {
    id: '5',
    name: 'Sports & Outdoors',
    icon: '⚽',
    count: 90
  },
  {
    id: '6',
    name: 'Books',
    icon: '📚',
    count: 110
  }
];
