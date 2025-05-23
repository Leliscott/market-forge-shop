
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useProductShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const shareProduct = async (productId: string, productName: string) => {
    setIsSharing(true);
    
    try {
      const productUrl = `${window.location.origin}/product/${productId}`;
      
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: productName,
          text: `Check out this product: ${productName}`,
          url: productUrl,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(productUrl);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback to copying to clipboard if native sharing fails
        try {
          const productUrl = `${window.location.origin}/product/${productId}`;
          await navigator.clipboard.writeText(productUrl);
          toast({
            title: "Link copied!",
            description: "Product link has been copied to clipboard",
          });
        } catch (clipboardError) {
          toast({
            title: "Error",
            description: "Unable to share or copy link",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return { shareProduct, isSharing };
};
