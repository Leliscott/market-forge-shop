
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, Key, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationPicker from '@/components/LocationPicker';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
  });
  
  // Redirect if not authenticated or user hasn't accepted terms
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    } else if (profile && !profile.accepted_terms) {
      navigate('/terms');
    }
  }, [isAuthenticated, profile, navigate]);
  
  // Initialize form data with profile info when available
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        location: profile.location || '',
      });
    }
  }, [profile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLocationChange = (location: string) => {
    setProfileData(prev => ({
      ...prev,
      location
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update profile in Supabase
      const success = await updateProfile({
        name: profileData.name,
        location: profileData.location,
      });
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get shareable store link if user is a seller
  const getStoreLink = () => {
    if (profile?.role === 'seller') {
      const baseUrl = window.location.origin;
      return `${baseUrl}/store/${user?.id}`;
    }
    return null;
  };
  
  const storeLink = getStoreLink();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-8 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
          
          <Tabs defaultValue="account" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              {profile?.role === 'seller' && (
                <TabsTrigger value="store">Store</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <LocationPicker 
                      onLocationSelect={handleLocationChange}
                      defaultLocation={profileData.location}
                    />
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Account Type</p>
                          <p className="text-sm text-muted-foreground">
                            {profile?.role === 'seller' ? 'Seller Account' : 'Buyer Account'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Terms & Conditions</p>
                          <p className="text-sm text-muted-foreground">
                            {profile?.accepted_terms 
                              ? 'You have accepted our terms and conditions' 
                              : 'You have not yet accepted our terms and conditions'}
                          </p>
                        </div>
                        {!profile?.accepted_terms && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/terms')}
                          >
                            Review Terms
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Email Verification</p>
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your email has been verified
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="mb-2 text-sm font-medium">Password</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Change your password to keep your account secure
                    </p>
                    <Button variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {profile?.role === 'seller' && (
              <TabsContent value="store">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Settings</CardTitle>
                    <CardDescription>
                      Manage your store's details and share your store link
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {storeLink && (
                      <div>
                        <p className="mb-2 text-sm font-medium">Share Your Store</p>
                        <div className="flex gap-2">
                          <Input
                            value={storeLink}
                            readOnly
                            className="bg-gray-50"
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(storeLink);
                              toast({
                                title: "Link copied",
                                description: "Store link copied to clipboard",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Share this link with customers to bring them directly to your store
                        </p>
                      </div>
                    )}
                    
                    <Button variant="outline" asChild>
                      <a href="/seller/dashboard">
                        Go to Seller Dashboard
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
