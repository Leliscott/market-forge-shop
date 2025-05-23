
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

        // Transform stores data
        const transformedStores: Store[] = (storesData || []).map(store => ({
          id: store.id,
          name: store.name,
          description: store.description || '',
          logo: store.logo || '/placeholder.svg',
          productCount: Array.isArray(store.products) ? store.products.length : store.products?.count || 0
        }));

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
