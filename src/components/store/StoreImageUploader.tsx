
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface StoreImageUploaderProps {
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  id: string;
  label: string;
  description: string;
}

const StoreImageUploader: React.FC<StoreImageUploaderProps> = ({
  imagePreview,
  handleImageChange,
  removeImage,
  id,
  label,
  description,
}) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <p className="text-sm text-muted-foreground mb-2">
        {description}
      </p>
      
      {!imagePreview ? (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label htmlFor={id} className="cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Click to upload {label.toLowerCase()}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF, max 5MB</p>
          </label>
        </div>
      ) : (
        <div className={`relative ${id === 'logo' ? 'w-32 h-32 mx-auto' : 'w-full h-40'}`}>
          <img
            src={imagePreview}
            alt={`${label} preview`}
            className="w-full h-full object-cover rounded-md"
          />
          <button
            type="button"
            onClick={removeImage}
            className={`absolute ${id === 'logo' ? '-top-2 -right-2' : 'top-2 right-2'} bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreImageUploader;
