
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import ProductFormTabs from '@/components/products/ProductFormTabs';

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  description: string;
  category: string;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

// Mock data for editing
const mockProduct = {
  id: '1',
  name: 'Wireless Earbuds',
  price: '599.99',
  stock: '42',
  description: 'High-quality wireless earbuds with noise cancellation and long battery life. Perfect for on-the-go listening with crystal clear sound and comfortable fit.',
  category: 'Audio',
  sku: 'WEB-001',
  weight: '0.3',
  dimensions: {
    length: '5',
    width: '5', 
    height: '2'
  },
  images: [
    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  ]
};

const categories = [
  "Audio",
  "Accessories",
  "Cables",
  "Power",
  "Smartphones",
  "Computers",
  "Photography",
  "Gaming",
  "Smart Home",
  "Other"
];

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewProduct = id === 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    sku: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    }
  });
  
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    // If editing an existing product, load its data
    if (!isNewProduct) {
      // In a real app, fetch from API. Here we use mock data.
      setFormData({
        name: mockProduct.name,
        price: mockProduct.price,
        stock: mockProduct.stock,
        description: mockProduct.description,
        category: mockProduct.category,
        sku: mockProduct.sku,
        weight: mockProduct.weight,
        dimensions: mockProduct.dimensions
      });
      
      setImages(mockProduct.images);
    }
  }, [isNewProduct, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: isNewProduct ? "Product created" : "Product updated",
        description: `"${formData.name}" has been ${isNewProduct ? 'created' : 'updated'} successfully.`
      });
      
      navigate('/seller/products');
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/seller/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {isNewProduct ? 'Add New Product' : 'Edit Product'}
              </h1>
              <p className="text-muted-foreground">
                {isNewProduct 
                  ? 'Create a new product to sell in your store'
                  : 'Update your product information'
                }
              </p>
            </div>
            {!isNewProduct && (
              <Button variant="outline" asChild>
                <a href={`/product/${id}`} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </Button>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <ProductFormTabs
              formData={formData}
              onInputChange={handleInputChange}
              images={images}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              categories={categories}
            />
            
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? isNewProduct ? "Creating..." : "Saving..."
                  : isNewProduct ? "Create Product" : "Save Changes"
                }
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditProduct;
