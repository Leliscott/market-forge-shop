
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  productCount?: number;
}

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Card className="overflow-hidden product-card">
      <Link to={`/store/${store.id}`}>
        <div className="relative h-40 overflow-hidden">
          {/* Banner image or fallback color */}
          <div 
            className="w-full h-full bg-gradient-to-r from-brand-teal/30 to-brand-navy/30"
            style={store.bannerImage ? {backgroundImage: `url(${store.bannerImage})`, backgroundSize: 'cover'} : {}}
          />
          
          {/* Store logo */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
            <img 
              src={store.logo || '/placeholder.svg'} 
              alt={store.name} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        <CardContent className="pt-12 pb-4 px-4 text-center">
          <h3 className="text-lg font-medium">{store.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {store.description}
          </p>
          {store.productCount !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">
              {store.productCount} products
            </p>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-center">
          <Button variant="outline">Visit Store</Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default StoreCard;
