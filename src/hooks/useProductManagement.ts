
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  sold: number;
  stock_quantity: number;
  created_at: string;
}

export const useProductManagement = () => {
  const { userStore } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProducts = async () => {
    if (!userStore) {
      setIsLoading(false);
      setError('No store found. Please create a store first.');
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', userStore.id);
      
      if (error) throw error;
      
      const transformedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock_quantity || 0,
        stock_quantity: product.stock_quantity || 0,
        status: product.stock_quantity === 0 ? 'out_of_stock' : 
                product.stock_quantity < 10 ? 'low_stock' : 'active',
        image: product.image || '/placeholder.svg',
        category: product.category || 'Uncategorized',
        sold: 0,
        created_at: product.created_at || '',
      }));
      
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userStore]);

  return {
    products,
    isLoading,
    error,
    deleteProduct,
    fetchProducts
  };
};
