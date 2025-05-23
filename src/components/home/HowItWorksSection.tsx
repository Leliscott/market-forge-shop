
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksSection = () => {
  return (
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
  );
};

export default HowItWorksSection;
