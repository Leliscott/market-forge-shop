
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Upload, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

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
  price: '59.99',
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
          ...prev[parent as keyof typeof prev],
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
            <Tabs defaultValue="basic" className="mb-8">
              <TabsList>
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <Card className="mt-4 border-t-0 rounded-tl-none">
                <CardContent className="p-6">
                  <TabsContent value="basic" className="space-y-6">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your product"
                        required
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="stock">Stock Quantity *</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">Product Images</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add high-quality images of your product. First image will be the main one.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                              <img
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                                  Main Image
                                </span>
                              )}
                            </div>
                          ))}
                          
                          {images.length < 8 && (
                            <div className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center p-4">
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <label htmlFor="image-upload" className="cursor-pointer text-center">
                                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Add Image</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP</p>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g. PROD-001"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label>Dimensions (cm)</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label htmlFor="dimensions.length" className="text-sm">Length</Label>
                          <Input
                            id="dimensions.length"
                            name="dimensions.length"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.dimensions.length}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dimensions.width" className="text-sm">Width</Label>
                          <Input
                            id="dimensions.width"
                            name="dimensions.width"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.dimensions.width}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dimensions.height" className="text-sm">Height</Label>
                          <Input
                            id="dimensions.height"
                            name="dimensions.height"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.dimensions.height}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
            
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
