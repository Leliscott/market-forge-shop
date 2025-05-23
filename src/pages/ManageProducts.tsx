
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTabs from '@/components/products/ProductTabs';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 59.99,
    stock: 42,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Electronics',
    sold: 153,
  },
  {
    id: '2',
    name: 'Phone Stand',
    price: 24.99,
    stock: 78,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Accessories',
    sold: 87,
  },
  {
    id: '3',
    name: 'USB-C Cable Pack',
    price: 15.99,
    stock: 156,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612815292890-fd55c355d8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Cables',
    sold: 65,
  },
  {
    id: '4',
    name: 'Portable Power Bank',
    price: 49.99,
    stock: 32,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Power',
    sold: 45,
  },
  {
    id: '5',
    name: 'Screen Protector',
    price: 12.99,
    stock: 0,
    status: 'out_of_stock',
    image: '/placeholder.svg',
    category: 'Accessories',
    sold: 32,
  },
  {
    id: '6',
    name: 'Wireless Charger',
    price: 29.99,
    stock: 5,
    status: 'low_stock',
    image: '/placeholder.svg',
    category: 'Power',
    sold: 28,
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 79.99,
    stock: 18,
    status: 'active',
    image: '/placeholder.svg',
    category: 'Audio',
    sold: 22,
  },
  {
    id: '8',
    name: 'Laptop Sleeve',
    price: 19.99,
    stock: 25,
    status: 'active',
    image: '/placeholder.svg',
    category: 'Accessories',
    sold: 17,
  },
];

const ManageProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const productsByStatus = {
    all: filteredProducts,
    active: filteredProducts.filter(p => p.status === 'active'),
    low_stock: filteredProducts.filter(p => p.status === 'low_stock'),
    out_of_stock: filteredProducts.filter(p => p.status === 'out_of_stock'),
  };

  const handleDeleteProduct = (productId: string) => {
    setConfirmDelete(productId);
  };
  
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
            <Button variant="destructive" onClick={() => setConfirmDelete(null)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
