
import React, { useState } from 'react';
import { ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useCart } from '@/context/CartContext';
import { useProductShare } from '@/hooks/useProductShare';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    store_id: string;
    stock?: number;
  };
  store: {
    phone?: string;
  };
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, store }) => {
  const { addToCart } = useCart();
  const { shareProduct, isSharing } = useProductShare();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      storeId: product.store_id,
      name: product.name,
      price: product.price,
      image: product.image
    }, quantity);
  };

  const handleShare = () => {
    shareProduct(product.id, product.name);
  };

  return (
    <div className="space-y-6">
      {/* Quantity and add to cart */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock || 10))}
            disabled={quantity >= (product.stock || 10)}
          >
            +
          </Button>
        </div>
        
        <Button
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={(product.stock || 0) === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>

      {/* Share button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleShare}
          disabled={isSharing}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? 'Sharing...' : 'Share Product'}
        </Button>
      </div>
      
      {/* Contact seller via WhatsApp */}
      <div className="pt-4">
        <WhatsAppContact 
          phoneNumber={store.phone || "0610000000"} 
          productName={product.name} 
        />
      </div>
      
      <Separator />
    </div>
  );
};

export default ProductActions;
