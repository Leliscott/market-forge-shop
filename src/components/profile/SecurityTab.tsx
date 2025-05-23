
import React from 'react';
import { ShieldCheck, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SecurityTab: React.FC = () => {
  return (
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
  );
};

export default SecurityTab;
