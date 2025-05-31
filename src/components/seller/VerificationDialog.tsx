
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeId: string;
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  storeName,
  storeId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    idDocument: null as File | null,
    selfieWithId: null as File | null
  });

  const handleFileChange = (field: 'idDocument' | 'selfieWithId', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      console.log(`Uploading file to ${path}:`, file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user?.id}/${path}/${fileName}`;

      // Ensure the bucket exists (this is safe to call multiple times)
      const { error: bucketError } = await supabase.storage
        .from('merchant-verifications')
        .list('', { limit: 1 });

      if (bucketError && bucketError.message.includes('The resource was not found')) {
        console.log('Creating merchant-verifications bucket...');
        const { error: createBucketError } = await supabase.storage
          .createBucket('merchant-verifications', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          });
        
        if (createBucketError) {
          console.warn('Could not create bucket (might already exist):', createBucketError);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('merchant-verifications')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('merchant-verifications')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.ownerName || !formData.idDocument || !formData.selfieWithId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload both required documents.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting verification submission...');
      
      // Upload documents
      const idDocumentUrl = await uploadFile(formData.idDocument, 'id-documents');
      const selfieUrl = await uploadFile(formData.selfieWithId, 'selfies');

      console.log('Documents uploaded successfully');

      // Submit verification request
      const { error } = await supabase
        .from('merchant_verifications')
        .insert({
          store_id: storeId,
          owner_id: user.id,
          merchant_name: storeName,
          owner_name: formData.ownerName,
          id_document_url: idDocumentUrl,
          selfie_url: selfieUrl,
          status: 'pending'
        });

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Verification request submitted successfully');

      toast({
        title: "Verification Submitted",
        description: "Your verification application has been submitted and is under review.",
      });

      onClose();
      
      // Reset form
      setFormData({
        ownerName: '',
        idDocument: null,
        selfieWithId: null
      });
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Get Verified</DialogTitle>
          <DialogDescription>
            Submit your verification documents to become a verified merchant and build customer trust.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="ownerName">Full Name (as on ID)</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label>South African ID Document</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {formData.idDocument ? formData.idDocument.name : 'Upload ID Document'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>
          </div>

          <div>
            <Label>Selfie with ID Document</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {formData.selfieWithId ? formData.selfieWithId.name : 'Upload Selfie with ID'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange('selfieWithId', e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <h4 className="font-medium mb-1">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clear photo of your South African ID document</li>
              <li>Selfie showing your face clearly alongside your ID</li>
              <li>Both documents must be readable and not expired</li>
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
