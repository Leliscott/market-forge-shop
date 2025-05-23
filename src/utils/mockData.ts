
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

// Mock categories for the marketplace
export const mockCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'toys', name: 'Toys & Games' }
];

// Sample products (temporary until we fully switch to database)
export const mockProducts = [];

// Sample stores (temporary until we fully switch to database)
export const mockStores = [];
