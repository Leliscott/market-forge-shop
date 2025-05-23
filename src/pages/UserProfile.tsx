
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AccountTab from '@/components/profile/AccountTab';
import SecurityTab from '@/components/profile/SecurityTab';
import StoreTab from '@/components/profile/StoreTab';

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
              <AccountTab 
                user={user}
                profile={profile}
                profileData={profileData}
                handleInputChange={handleInputChange}
                handleLocationChange={handleLocationChange}
                handleProfileSubmit={handleProfileSubmit}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
            
            {profile?.role === 'seller' && (
              <TabsContent value="store">
                <StoreTab storeLink={storeLink} />
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
