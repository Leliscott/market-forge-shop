
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

const Index = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.allSettled to handle cases where tables might be empty
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
          console.warn('No products found or error fetching products');
          setNewProducts([]);
        }
        
        // Handle stores result
        if (storeResult.status === 'fulfilled' && storeResult.value.data) {
          setFeaturedStores(storeResult.value.data);
        } else {
          console.warn('No stores found or error fetching stores');
          setFeaturedStores([]);
        }
        
      } catch (error) {
        console.error('Error fetching featured data:', error);
        // Set empty arrays on error to prevent UI issues
        setNewProducts([]);
        setFeaturedStores([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
