
import React from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ image, name }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
      <img
        src={image || '/placeholder.svg'}
        alt={name}
        className="object-contain w-full h-auto max-h-[500px]"
      />
    </div>
  );
};

export default ProductGallery;
