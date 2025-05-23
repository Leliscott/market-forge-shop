
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreCard from '@/components/StoreCard';

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  productCount?: number;
}

interface FeaturedStoresSectionProps {
  stores: Store[];
  loading: boolean;
}

const FeaturedStoresSection: React.FC<FeaturedStoresSectionProps> = ({ stores, loading }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Stores</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/stores" className="flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map(store => (
              <StoreCard 
                key={store.id} 
                store={{
                  id: store.id,
                  name: store.name,
                  description: store.description,
                  logo: store.logo
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Stores Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Join our marketplace and be among the first sellers!
              </p>
              <Button asChild>
                <Link to="/seller/dashboard">
                  Create Store
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStoresSection;
