
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import ProductFormTabs from '@/components/products/ProductFormTabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  const { userStore } = useAuth();
  const isNewProduct = id === 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNewProduct);
  
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
    const fetchProduct = async () => {
      if (!isNewProduct && id) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching product:', error);
            toast({
              title: "Error",
              description: "Failed to load product. Please try again.",
              variant: "destructive"
            });
            return;
          }

          if (data) {
            setFormData({
              name: data.name || '',
              price: data.price?.toString() || '',
              stock: data.stock_quantity?.toString() || '',
              description: data.description || '',
              category: data.category || '',
              sku: '',
              weight: '',
              dimensions: {
                length: '',
                width: '',
                height: ''
              }
            });
            
            if (data.image) {
              setImages([data.image]);
            }
          }
        } catch (err) {
          console.error('Error:', err);
          toast({
            title: "Error",
            description: "Failed to load product. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [isNewProduct, id, toast]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userStore) {
      toast({
        title: "Error",
        description: "You need to have a store to create products.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Price, Category).",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock) || 0,
        category: formData.category,
        image: images[0] || null,
        store_id: userStore.id,
        is_new_listing: isNewProduct
      };

      if (isNewProduct) {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: `"${formData.name}" has been created successfully.`
        });
      } else {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: `"${formData.name}" has been updated successfully.`
        });
      }
      
      navigate('/seller/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
