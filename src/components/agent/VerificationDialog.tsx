
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserX, CheckCheck, ExternalLink } from 'lucide-react';

interface VerificationRequest {
  id: string;
  merchant_name: string;
  store_id: string;
  owner_name: string;
  submission_date: string;
  status: string;
  id_document_url: string;
  selfie_url: string;
  owner_id: string;
}

interface VerificationDialogProps {
  request: VerificationRequest | null;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({
  request,
  onClose,
  onApprove,
  onReject
}) => {
  if (!request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    const target = e.currentTarget;
    target.style.display = 'none';
    
    // Show fallback message
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback && fallback.classList.contains('image-fallback')) {
      fallback.style.display = 'block';
    }
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const ImageViewer = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{label}:</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openImageInNewTab(src)}
          className="flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden bg-gray-50 relative">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-48 object-contain cursor-pointer hover:opacity-80 transition-opacity" 
          onError={handleImageError}
          onClick={() => openImageInNewTab(src)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <div 
          className="image-fallback hidden absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm"
        >
          <div className="text-center">
            <p>Image failed to load</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => openImageInNewTab(src)}
              className="text-blue-600 underline"
            >
              Try opening in new tab
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1 break-all">URL: {src}</p>
    </div>
  );

  return (
    <Dialog open={!!request} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Merchant Verification</DialogTitle>
          <DialogDescription>
            Review the submitted documents and approve or reject the verification request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Merchant Details</h3>
              <div className="space-y-2">
                <p><strong>Store Name:</strong> {request.merchant_name}</p>
                <p><strong>Owner Name:</strong> {request.owner_name}</p>
                <p><strong>Submission Date:</strong> {formatDate(request.submission_date)}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Verification Documents</h3>
              <div className="space-y-4">
                <ImageViewer
                  src={request.id_document_url}
                  alt="South African ID Document"
                  label="South African ID Document"
                />
                
                <ImageViewer
                  src={request.selfie_url}
                  alt="Selfie with ID"
                  label="Selfie with ID"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md text-sm">
            <h3 className="font-medium mb-2">Verification Guidelines</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure the ID document is clearly visible and not expired</li>
              <li>The selfie should clearly show the merchant's face alongside their ID</li>
              <li>Verify that the name on the ID matches the registered owner name</li>
              <li>Check that the ID number format follows South African ID standards (13 digits)</li>
              <li>Ensure both images are authentic and not digitally manipulated</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {request.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => onReject(request.id)}
                className="flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Reject Verification
              </Button>
              
              <Button 
                onClick={() => onApprove(request.id)}
                className="flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Approve Verification
              </Button>
            </>
          )}
          
          {request.status !== 'pending' && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
