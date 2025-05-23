
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/LocationPicker';
import { Profile } from '@/context/types/AuthTypes';

interface AccountTabProps {
  user: {
    email: string | undefined;
  } | null;
  profile: Profile | null;
  profileData: {
    name: string;
    location: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationChange: (location: string) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AccountTab: React.FC<AccountTabProps> = ({
  user,
  profile,
  profileData,
  handleInputChange,
  handleLocationChange,
  handleProfileSubmit,
  isLoading
}) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default AccountTab;
