
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  owner_id: string;
  created_at: string;
}

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

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
        setProducts(productData || []);
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
        <div 
          className="w-full h-60 md:h-80 bg-gradient-to-r from-primary/30 to-primary-foreground/30 bg-cover bg-center"
          style={store.bannerImage ? { backgroundImage: `url(${store.bannerImage})` } : {}}
        >
          <div className="container h-full mx-auto px-4 flex items-end pb-16">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white overflow-hidden">
                <img 
                  src={store.logo || '/placeholder.svg'} 
                  alt={store.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-white drop-shadow-md">
                <h1 className="text-3xl md:text-4xl font-bold">{store.name}</h1>
                <p className="mt-1 max-w-2xl">{store.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Store Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="products">
            <TabsList className="mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} storeView={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">This store has no products yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">About {store.name}</h2>
                <p className="mb-4">{store.description}</p>
                <p className="text-sm text-muted-foreground">
                  Store created on {new Date(store.created_at).toLocaleDateString()}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreView;
