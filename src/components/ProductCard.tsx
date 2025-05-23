
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  storeView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, storeView = false }) => {
  const { addToCart } = useCart();
  
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
    <Card className="overflow-hidden product-card">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden aspect-square">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
          <p className="mt-1 font-semibold text-primary">R {product.price.toFixed(2)}</p>
          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
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
      </Link>
    </Card>
  );
};

export default ProductCard;
