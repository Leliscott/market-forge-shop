
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserX, CheckCheck } from 'lucide-react';

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

  return (
    <Dialog open={!!request} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Merchant Verification</DialogTitle>
          <DialogDescription>
            Review the submitted documents and approve or reject the verification request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Merchant Details</h3>
              <p><strong>Store Name:</strong> {request.merchant_name}</p>
              <p><strong>Owner Name:</strong> {request.owner_name}</p>
              <p><strong>Submission Date:</strong> {formatDate(request.submission_date)}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Verification Documents</h3>
              <div className="space-y-2">
                <div>
                  <p className="mb-1">South African ID Document:</p>
                  <img 
                    src={request.id_document_url} 
                    alt="ID Document" 
                    className="h-40 w-full object-cover rounded-md border" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div>
                  <p className="mb-1">Selfie with ID:</p>
                  <img 
                    src={request.selfie_url} 
                    alt="Selfie with ID" 
                    className="h-40 w-full object-cover rounded-md border" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md text-sm">
            <h3 className="font-medium mb-1">Verification Guidelines</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure the ID document is clearly visible and not expired</li>
              <li>The selfie should clearly show the merchant's face alongside their ID</li>
              <li>Verify that the name on the ID matches the registered owner name</li>
              <li>Check that the ID number format follows South African ID standards</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {request.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => onReject(request.id)}
              >
                <UserX className="w-4 h-4 mr-1" />
                Reject
              </Button>
              
              <Button 
                onClick={() => onApprove(request.id)}
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Approve
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
