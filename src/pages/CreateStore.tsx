
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreForm from '@/components/store/StoreForm';
import { useAuth } from '@/context/AuthContext';

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const { profile, userStore } = useAuth();
  
  // Check if user has accepted terms
  useEffect(() => {
    if (profile && !profile.accepted_terms) {
      navigate('/terms');
    } else if (userStore) {
      // If user already has a store, redirect to settings
      navigate('/seller/store-settings');
    }
  }, [profile, userStore, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <Store className="w-12 h-12 mx-auto mb-2 text-primary" />
            <h1 className="text-3xl font-bold">Create Your Store</h1>
            <p className="text-muted-foreground">
              Set up your store to start selling products on our marketplace
            </p>
          </div>
          
          <StoreForm isEditing={false} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateStore;
