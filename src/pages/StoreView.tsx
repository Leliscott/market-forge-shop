
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import StoreBanner from '@/components/store/StoreBanner';
import StoreAbout from '@/components/store/StoreAbout';
import StoreProducts from '@/components/store/StoreProducts';
import { Store, Product, DbProduct } from '@/components/store/types';

const StoreView: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      
      try {
        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();
        
        if (storeError) throw storeError;
        
        // Fetch products for this store
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId);
          
        if (productError) throw productError;
        
        setStore(storeData);
        
        // Map database products to the format expected by ProductCard
        if (productData) {
          const mappedProducts = productData.map((dbProduct: DbProduct) => ({
            id: dbProduct.id,
            storeId: dbProduct.store_id,
            name: dbProduct.name,
            price: dbProduct.price,
            image: dbProduct.image || '',
            description: dbProduct.description || '',
            category: 'uncategorized' // Default category as it's not in the DB
          }));
          
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading store...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Store not found</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Store Banner */}
        <StoreBanner 
          name={store.name} 
          description={store.description} 
          logo={store.logo}
          bannerImage={store.bannerImage}
        />
        
        {/* Store Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="products">
            <TabsList className="mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <StoreProducts products={products} />
            </TabsContent>
            
            <TabsContent value="about">
              <StoreAbout 
                name={store.name} 
                description={store.description} 
                createdAt={store.created_at} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreView;
