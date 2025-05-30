
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/context/CartContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/constants';

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  verified?: boolean;
}

interface ProductCardProps {
  product: Product;
  storeView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, storeView = false }) => {
  const { addToCart } = useCart();
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    const checkStoreVerification = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('verified')
        .eq('id', product.storeId)
        .single();

      if (data && !error) {
        setIsVerified(data.verified || false);
      }
    };

    checkStoreVerification();
  }, [product.storeId]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      image: product.image
    }, 1);
  };

  return (
    <Card className="overflow-hidden product-card relative">
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          <div className="overflow-hidden aspect-square">
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        
        {!storeView && (
          <Link
            to={`/store/${product.storeId}`}
            className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs font-medium py-1 px-2 rounded-md hover:bg-opacity-100"
          >
            View Store
          </Link>
        )}
        
        {isVerified && (
          <div className="absolute top-2 left-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Verified Merchant</p>
                  <p className="text-xs text-muted-foreground">This seller has been verified by our agents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
          <p className="mt-1 font-semibold text-primary">{formatCurrency(product.price)}</p>
          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" /> 
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
