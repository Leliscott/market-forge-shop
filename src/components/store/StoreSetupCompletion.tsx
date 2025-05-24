
import React from 'react';
import { Button } from '@/components/ui/button';
import DeliveryServicesForm from './DeliveryServicesForm';

interface StoreSetupCompletionProps {
  currentStoreId: string | null;
  userStoreId?: string;
  isEditing: boolean;
  onFinishSetup: () => void;
}

const StoreSetupCompletion: React.FC<StoreSetupCompletionProps> = ({
  currentStoreId,
  userStoreId,
  isEditing,
  onFinishSetup
}) => {
  const storeId = currentStoreId || userStoreId || '';

  if (!storeId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DeliveryServicesForm 
        storeId={storeId} 
        isEditing={true}
      />
      
      {!isEditing && currentStoreId && (
        <div className="flex justify-center">
          <Button onClick={onFinishSetup} size="lg">
            Complete Store Setup
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreSetupCompletion;
