
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import StoreCard from '@/components/StoreCard';
import { mockProducts, mockStores, mockCategories } from '@/utils/mockData';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  
  // Get initial filter from URL
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
    
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
    
    const tab = searchParams.get('tab');
    if (tab === 'stores') {
      setActiveTab('stores');
    }
  }, [searchParams]);
  
  // Filter products based on search term, categories, and price range
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Filter stores based on search term
  const filteredStores = mockStores.filter(store => {
    return store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           store.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    if (value === 'stores') {
      newParams.set('tab', 'stores');
    } else {
      newParams.delete('tab');
    }
    setSearchParams(newParams);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} />
      
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-white border-b">
          <div className="container px-4 py-8 mx-auto">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="mt-2 text-muted-foreground">
              Discover products and stores from independent sellers
            </p>
            
            <form onSubmit={handleSearch} className="flex mt-6 space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products or stores..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
        
        <div className="container px-4 py-8 mx-auto">
          {/* Tabs */}
          <Tabs
            defaultValue="products"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Filters sidebar */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  {(searchTerm || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 text-xs"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Clear all
                    </Button>
                  )}
                </div>
                
                {/* Only show categories and price filters for products tab */}
                {activeTab === 'products' && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Categories</h3>
                      <div className="space-y-2">
                        {mockCategories.map(category => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <span className="text-sm text-muted-foreground">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Results */}
              <div className="md:col-span-3">
                <TabsContent value="products" className="m-0">
                  {filteredProducts.length > 0 ? (
                    <>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                      </p>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="mt-4"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="stores" className="m-0">
                  {filteredStores.length > 0 ? (
                    <>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'}
                      </p>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStores.map(store => (
                          <StoreCard key={store.id} store={store} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-lg text-muted-foreground">No stores found matching your search.</p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
