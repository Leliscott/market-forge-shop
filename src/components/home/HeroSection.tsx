
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative pb-12">
      <div className="absolute inset-0 bg-brand-navy/5 dark:bg-brand-navy/20 -z-10" />
      <div className="container px-4 py-16 mx-auto text-center lg:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl dark:text-white">
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
  );
};

export default HeroSection;
