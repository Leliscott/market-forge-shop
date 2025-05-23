
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface StoreTabProps {
  storeLink: string | null;
}

const StoreTab: React.FC<StoreTabProps> = ({ storeLink }) => {
  const { toast } = useToast();
  
  if (!storeLink) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>
          Manage your store's details and share your store link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <Button variant="outline" asChild>
          <a href="/seller/dashboard">
            Go to Seller Dashboard
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreTab;
