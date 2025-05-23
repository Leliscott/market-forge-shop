
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Store, Check, CheckCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/constants';

interface Store {
  id: string;
  name: string;
  verified?: boolean;
}

interface ProductInfoProps {
  name: string;
  price: number;
  stock?: number;
  rating?: number;
  store: Store;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ name, price, stock = 0, rating = 0, store }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkStoreVerification = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('verified')
        .eq('id', store.id)
        .single();

      if (data && !error) {
        setIsVerified(data.verified || false);
      }
    };

    checkStoreVerification();
  }, [store.id]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          <Link 
            to={`/store/${store.id}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <Store className="w-4 h-4 mr-1" />
            {store.name}
          </Link>
          
          {isVerified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified Merchant</p>
                  <p className="text-xs text-muted-foreground">This seller has been verified by our agents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold">{name}</h1>
        
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
      
      <div className="text-3xl font-bold text-primary">
        {formatCurrency(price)}
      </div>
      
      {/* Stock status */}
      <div className="flex items-center space-x-2">
        {stock > 0 ? (
          <>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="w-3 h-3 mr-1" />
              In Stock
            </Badge>
            <span className="text-sm text-muted-foreground">{stock} available</span>
          </>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Visit Store button */}
      <div className="pt-4">
        <Button variant="outline" asChild className="w-full gap-2">
          <Link to={`/store/${store.id}`}>
            <Store className="w-4 h-4" />
            Visit Store
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
