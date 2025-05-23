
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTabs from '@/components/products/ProductTabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  sold: number;
  stock_quantity: number;
  created_at: string;
}

interface ProductsByStatus {
  all: Product[];
  active: Product[];
  low_stock: Product[];
  out_of_stock: Product[];
}

const ManageProducts: React.FC = () => {
  const { userStore } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Function to fetch products from Supabase
  const fetchProducts = async () => {
    if (!userStore) {
      setIsLoading(false);
      setError('No store found. Please create a store first.');
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', userStore.id);
      
      if (error) throw error;
      
      // Transform the data to match our expected format
      const transformedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock_quantity || 0,
        stock_quantity: product.stock_quantity || 0,
        status: product.stock_quantity === 0 ? 'out_of_stock' : 
                product.stock_quantity < 10 ? 'low_stock' : 'active',
        image: product.image || '/placeholder.svg',
        category: product.category || 'Uncategorized',
        sold: 0, // Default since we don't have this info yet
        created_at: product.created_at,
      }));
      
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [userStore]);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Organize products by status
  const productsByStatus: ProductsByStatus = {
    all: filteredProducts,
    active: filteredProducts.filter(p => p.status === 'active'),
    low_stock: filteredProducts.filter(p => p.status === 'low_stock'),
    out_of_stock: filteredProducts.filter(p => p.status === 'out_of_stock'),
  };

  // Handle product deletion
  const handleDeleteProduct = (productId: string) => {
    setConfirmDelete(productId);
  };
  
  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', confirmDelete);
      
      if (error) throw error;
      
      // Update local state
      setProducts(products.filter(product => product.id !== confirmDelete));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setConfirmDelete(null);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Render error state
  if (error && !userStore) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">No Store Found</h1>
            <p className="mb-6 text-muted-foreground">You need to create a store before managing products.</p>
            <Button asChild>
              <Link to="/create-store">Create Store</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Products</h1>
              <p className="text-muted-foreground">
                Manage your product inventory
              </p>
            </div>
            
            <Button asChild>
              <Link to="/seller/products/edit/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
          
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          <ProductTabs
            productsByStatus={productsByStatus}
            viewMode={viewMode}
            onDeleteProduct={handleDeleteProduct}
            searchTerm={searchTerm}
            isLoading={isLoading}
          />
        </div>
      </main>
      
      <Footer />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
