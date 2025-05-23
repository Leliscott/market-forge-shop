
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/utils/constants';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  sold: number;
}

interface ProductGridViewProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
}

const ProductGridView: React.FC<ProductGridViewProps> = ({ products, onDeleteProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.status === 'out_of_stock' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                Out of Stock
              </div>
            )}
            {product.status === 'low_stock' && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                Low Stock: {product.stock}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/seller/products/edit/${product.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/product/${product.id}`}>
                      <Package className="mr-2 h-4 w-4" /> View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => onDeleteProduct(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-4">
            <Link to={`/seller/products/edit/${product.id}`}>
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="font-semibold">{formatCurrency(product.price)}</p>
                <p className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {product.sold} sold • {product.category}
              </p>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductGridView;
