
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  defaultImage?: string;
  label?: string;
  id: string;
  bucketName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  defaultImage = '',
  label = 'Image',
  id,
  bucketName = 'product-images' 
}) => {
  const [imagePreview, setImagePreview] = useState<string>(defaultImage);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Preview the image locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to Supabase Storage
    setUploading(true);
    
    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Pass the URL to the parent component
      onImageUpload(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
      
      // If upload fails, remove the preview
      if (!defaultImage) {
        setImagePreview('');
      } else {
        setImagePreview(defaultImage);
      }
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = () => {
    setImagePreview('');
    onImageUpload('');
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      {!imagePreview ? (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor={id} className="cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG or GIF, max 5MB
            </p>
          </label>
        </div>
      ) : (
        <div className="relative border rounded-md overflow-hidden">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto object-cover max-h-[300px]"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
