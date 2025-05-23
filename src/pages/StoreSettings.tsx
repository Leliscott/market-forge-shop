
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreForm from '@/components/store/StoreForm';
import { useAuth } from '@/context/AuthContext';

const StoreSettings: React.FC = () => {
  const navigate = useNavigate();
  const { userStore, profile } = useAuth();
  
  // Check if user has accepted terms and has a store
  useEffect(() => {
    if (profile && !profile.accepted_terms) {
      navigate('/terms');
    } else if (!userStore) {
      navigate('/seller/create-store');
    }
  }, [profile, userStore, navigate]);
  
  if (!userStore) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-3xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/seller/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="mb-8 text-center">
            <Store className="w-12 h-12 mx-auto mb-2 text-primary" />
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <p className="text-muted-foreground">
              Update your store information and settings
            </p>
          </div>
          
          <StoreForm isEditing={true} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreSettings;
