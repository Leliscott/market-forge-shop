
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  store_id: string;
  stock?: number;
  features?: string[];
  rating?: number;
}

interface Store {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  phone?: string;
}

export const useProduct = (productId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productError) throw productError;
        if (!productData) throw new Error('Product not found');
        
        // Add some defaults for backward compatibility
        const enhancedProduct = {
          ...productData,
          stock: 10, // Default stock value
          rating: 4.5, // Default rating
          features: [
            'High quality materials',
            'Fast shipping',
            'Secure payment processing',
            'Customer satisfaction guaranteed'
          ]
        };
        
        setProduct(enhancedProduct);
        
        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', productData.store_id)
          .single();
        
        if (storeError) throw storeError;
        
        setStore(storeData);
        
        // Fetch related products (same store, different product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', productData.store_id)
          .neq('id', productId)
          .limit(4);
        
        if (relatedError) throw relatedError;
        
        setRelatedProducts(relatedData || []);
        
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);
  
  return {
    loading,
    error,
    product,
    store,
    relatedProducts
  };
};
