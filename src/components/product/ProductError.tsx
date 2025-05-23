
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductErrorProps {
  error: string | null;
}

const ProductError: React.FC<ProductErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center">
      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
      <h2 className="mt-4 text-2xl font-bold">Product not found</h2>
      <p className="mt-2 text-muted-foreground">
        {error || "The product you're looking for doesn't exist or has been removed."}
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
    </div>
  );
};

export default ProductError;
