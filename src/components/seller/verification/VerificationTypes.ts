
export interface VerificationFormData {
  ownerName: string;
  idDocument: File | null;
  selfieWithId: File | null;
}

export interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeId: string;
}
