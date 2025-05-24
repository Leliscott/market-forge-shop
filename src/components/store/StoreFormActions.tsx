
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface StoreFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
}

const StoreFormActions: React.FC<StoreFormActionsProps> = ({
  isEditing,
  isSubmitting
}) => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/seller/dashboard')}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating Store..." : "Creating Store...") 
          : (isEditing ? "Update Store" : "Create Store")
        }
      </Button>
    </div>
  );
};

export default StoreFormActions;
