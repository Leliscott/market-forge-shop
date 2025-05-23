
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    category: ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Check if user has accepted terms
  useEffect(() => {
    if (profile && !profile.accepted_terms) {
      navigate('/terms');
    }
  }, [profile, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };
  
  const removeBanner = () => {
    setBannerPreview(null);
    setBannerFile(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a store",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.description || !formData.email || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create store in Supabase
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: formData.name,
          description: formData.description,
          owner_id: user.id,
          logo: logoPreview || '',
        })
        .select()
        .single();
      
      if (storeError) throw storeError;
      
      toast({
        title: "Store created successfully",
        description: `Your store "${formData.name}" has been created.`,
      });
      
      navigate('/seller/dashboard');
    } catch (error) {
      console.error("Error creating store:", error);
      toast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <Store className="w-12 h-12 mx-auto mb-2 text-primary" />
            <h1 className="text-3xl font-bold">Create Your Store</h1>
            <p className="text-muted-foreground">
              Set up your store to start selling products on our marketplace
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Store Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your store name"
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
                        placeholder="Tell customers what your store is about"
                        required
                        className="min-h-[120px]"
                      />
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
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="home">Home & Garden</option>
                        <option value="beauty">Beauty & Personal Care</option>
                        <option value="toys">Toys & Games</option>
                        <option value="sports">Sports & Outdoors</option>
                        <option value="books">Books & Media</option>
                        <option value="handmade">Handmade</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Store Images</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="logo">Store Logo *</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a logo that represents your brand (recommended: 512x512px)
                      </p>
                      
                      {!logoPreview ? (
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                          <label htmlFor="logo" className="cursor-pointer">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload logo</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF, max 5MB</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="banner">Store Banner</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a banner image for your store (recommended: 1200x400px)
                      </p>
                      
                      {!bannerPreview ? (
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          <input
                            id="banner"
                            type="file"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="hidden"
                          />
                          <label htmlFor="banner" className="cursor-pointer">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload banner</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF, max 5MB</p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative w-full h-40">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={removeBanner}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your business email"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your business phone"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/seller/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Store..." : "Create Store"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateStore;
