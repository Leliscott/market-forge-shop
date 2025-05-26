
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockCategories } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/home/HeroSection';
import NewProductsSection from '@/components/home/NewProductsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedStoresSection from '@/components/home/FeaturedStoresSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import AgentPortal from '@/components/agent/AgentPortal';

const Index: React.FC = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use Promise.allSettled for better error handling and performance
        const [productResult, storeResult] = await Promise.allSettled([
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('stores')
            .select('*')
            .limit(4)
        ]);
        
        // Handle products result
        if (productResult.status === 'fulfilled' && productResult.value.data) {
          setNewProducts(productResult.value.data);
        } else {
          setNewProducts([]);
        }
        
        // Handle stores result
        if (storeResult.status === 'fulfilled' && storeResult.value.data) {
          setFeaturedStores(storeResult.value.data);
        } else {
          setFeaturedStores([]);
        }
        
      } catch (error) {
        console.error('Error fetching featured data:', error);
        setNewProducts([]);
        setFeaturedStores([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small delay to prevent blocking the main thread
    const timeoutId = setTimeout(fetchData, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <NewProductsSection products={newProducts} loading={loading} />
        <CategoriesSection categories={mockCategories} />
        <FeaturedStoresSection stores={featuredStores} loading={loading} />
        <HowItWorksSection />
      </main>
      
      <AgentPortal />
      <Footer />
    </div>
  );
};

export default Index;
