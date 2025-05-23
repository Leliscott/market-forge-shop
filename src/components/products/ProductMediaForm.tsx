
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ProductMediaFormProps {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

const ProductMediaForm: React.FC<ProductMediaFormProps> = ({
  images,
  onImageUpload,
  onRemoveImage
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-1">Product Images</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add high-quality images of your product. First image will be the main one.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                  Main Image
                </span>
              )}
            </div>
          ))}
          
          {images.length < 8 && (
            <div className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center p-4">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Add Image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP</p>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMediaForm;
