
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import StoreCard from '@/components/StoreCard';
import { mockProducts, mockStores, mockCategories } from '@/utils/mockData';

const Index = () => {
  const featuredProducts = mockProducts.slice(0, 4);
  const featuredStores = mockStores.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative pb-12">
          <div className="absolute inset-0 bg-brand-navy/5 -z-10" />
          <div className="container px-4 py-16 mx-auto text-center lg:py-24">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your Products, Your Store, <span className="text-brand-teal">Your Way</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground">
              Create your own online store and sell your products to customers worldwide.
              Join our marketplace and start selling today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button asChild size="lg">
                <Link to="/marketplace">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Start Selling</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured products section */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Products</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/marketplace" className="flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section className="py-12 bg-slate-50">
          <div className="container px-4 mx-auto">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-center md:text-3xl">Shop By Category</h2>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {mockCategories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/marketplace?category=${category.id}`}
                  className="flex flex-col items-center justify-center p-4 text-center transition-colors bg-white border rounded-lg gap-y-2 hover:border-brand-teal"
                >
                  <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-brand-teal">
                    <span className="text-lg font-medium">{category.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured stores section */}
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
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredStores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-12 bg-brand-navy/5">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-2xl font-bold tracking-tight text-center md:text-3xl">How It Works</h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-white rounded-full bg-brand-teal">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create Your Store</h3>
                <p className="text-muted-foreground">Sign up and create your own customizable store in minutes.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-white rounded-full bg-brand-teal">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Add Your Products</h3>
                <p className="text-muted-foreground">Upload your products with descriptions, images, and pricing.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-white rounded-full bg-brand-teal">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Start Selling</h3>
                <p className="text-muted-foreground">Share your store, receive orders, and grow your business.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link to="/register">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
