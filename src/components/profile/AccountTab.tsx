
import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/LocationPicker';
import { Profile } from '@/context/types/AuthTypes';

interface AccountTabProps {
  user: {
    email?: string | undefined;
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
    <div className="space-y-6">
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Enhanced Legal Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Legal Compliance Status
          </CardTitle>
          <CardDescription>
            South African law compliance for marketplace participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.accepted_terms ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-medium">✓ Fully Compliant</p>
                  <p className="text-sm">You have accepted our comprehensive terms and conditions including:</p>
                  <ul className="text-xs space-y-1 ml-4 list-disc">
                    <li>Protection of Personal Information Act (POPIA) compliance</li>
                    <li>Consumer Protection Act (CPA) acknowledgment</li>
                    <li>Electronic Communications and Transactions Act (ECT Act) consent</li>
                    <li>VAT and taxation obligations (SARS compliance)</li>
                    {profile.role === 'seller' && <li>Merchant verification requirements</li>}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-3">
                  <p className="font-medium">⚠ Action Required</p>
                  <p className="text-sm">
                    You must accept our terms and conditions to comply with South African e-commerce regulations.
                    This includes POPIA privacy provisions and Consumer Protection Act compliance.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/terms')}
                    className="mt-2"
                  >
                    Accept Terms & Conditions
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
