
import React from 'react';
import { Clock, Package, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NewProduct } from '@/hooks/useSellerData';

interface NewStockViewProps {
  products: NewProduct[];
  isLoading: boolean;
}

const NewStockView: React.FC<NewStockViewProps> = ({ products, isLoading }) => {
  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return 'Expired';
    if (hours < 1) return `${Math.round(hours * 60)}m remaining`;
    return `${Math.round(hours)}h remaining`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            New Stock (48hr Period)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading new stock...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            New Stock (48hr Period)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No New Listings</h3>
            <p className="text-muted-foreground mb-4">
              You haven't added any new products in the last 48 hours.
            </p>
            <Button asChild>
              <Link to="/seller/products/edit/new">
                Add New Product
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          New Stock (48hr Period)
          <Badge variant="secondary">{products.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${product.price.toFixed(2)} • Stock: {product.stock_quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${
                    product.timeRemaining <= 12 
                      ? 'text-red-500 font-medium' 
                      : product.timeRemaining <= 24 
                      ? 'text-yellow-600 font-medium' 
                      : 'text-green-600'
                  }`}>
                    {formatTimeRemaining(product.timeRemaining)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={product.timeRemaining > 0 ? "default" : "secondary"}
                  className={product.timeRemaining > 0 ? "bg-green-500" : ""}
                >
                  {product.timeRemaining > 0 ? "NEW" : "EXPIRED"}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/seller/products/edit/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">New Listing Timer</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Products are marked as "NEW" for 48 hours after creation. This helps customers 
                discover your latest offerings. The timer automatically expires after 48 hours.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewStockView;
