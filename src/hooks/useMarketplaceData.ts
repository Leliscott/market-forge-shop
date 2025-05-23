
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  productCount: number;
}

export const useMarketplaceData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Fetch stores with product count
        const { data: storesData, error: storesError } = await supabase
          .from('stores')
          .select(`
            *,
            products(count)
          `);

        if (storesError) throw storesError;

        // Transform products data
        const transformedProducts: Product[] = (productsData || []).map(product => ({
          id: product.id,
          storeId: product.store_id,
          name: product.name,
          price: product.price,
          image: product.image || '/placeholder.svg',
          description: product.description || '',
          category: product.category || 'Uncategorized'
        }));

        // Transform stores data with proper product count handling
        const transformedStores: Store[] = (storesData || []).map(store => {
          let productCount = 0;
          
          // Handle the products count from the aggregation
          if (store.products && Array.isArray(store.products) && store.products.length > 0) {
            // If it's an array with count objects
            productCount = store.products[0]?.count || 0;
          } else if (typeof store.products === 'number') {
            // If it's already a number
            productCount = store.products;
          }

          return {
            id: store.id,
            name: store.name,
            description: store.description || '',
            logo: store.logo || '/placeholder.svg',
            productCount: productCount
          };
        });

        setProducts(transformedProducts);
        setStores(transformedStores);
      } catch (err: any) {
        console.error('Error fetching marketplace data:', err);
        setError('Failed to load marketplace data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    products,
    stores,
    isLoading,
    error
  };
};
