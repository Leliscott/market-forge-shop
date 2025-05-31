
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Camera } from 'lucide-react';
import { VerificationDialogProps, VerificationFormData } from './verification/VerificationTypes';
import FileUploadField from './verification/FileUploadField';
import VerificationRequirements from './verification/VerificationRequirements';
import { useVerificationSubmit } from './verification/useVerificationSubmit';

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  storeName,
  storeId
}) => {
  const { submitVerification, isSubmitting } = useVerificationSubmit();
  const [formData, setFormData] = useState<VerificationFormData>({
    ownerName: '',
    idDocument: null,
    selfieWithId: null
  });

  const handleFileChange = (field: keyof Pick<VerificationFormData, 'idDocument' | 'selfieWithId'>, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitVerification(formData, storeName, storeId);
    
    if (success) {
      onClose();
      // Reset form
      setFormData({
        ownerName: '',
        idDocument: null,
        selfieWithId: null
      });
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

          <FileUploadField
            label="South African ID Document"
            icon={FileText}
            file={formData.idDocument}
            onChange={(file) => handleFileChange('idDocument', file)}
            required
          />

          <FileUploadField
            label="Selfie with ID Document"
            icon={Camera}
            file={formData.selfieWithId}
            onChange={(file) => handleFileChange('selfieWithId', file)}
            required
          />

          <VerificationRequirements />

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
