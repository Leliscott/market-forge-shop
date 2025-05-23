
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface VerificationStatus {
  hasApplication: boolean;
  status: string | null;
  isVerified: boolean;
  isLoading: boolean;
}

export const useVerificationStatus = (storeId?: string) => {
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    hasApplication: false,
    status: null,
    isVerified: false,
    isLoading: true
  });

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!user || !storeId) {
        setVerificationStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Check verification application
        const { data: verificationData, error: verificationError } = await supabase
          .from('merchant_verifications')
          .select('status')
          .eq('store_id', storeId)
          .eq('owner_id', user.id)
          .single();

        if (verificationError && verificationError.code !== 'PGRST116') {
          throw verificationError;
        }

        // Check store verification status
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('verified')
          .eq('id', storeId)
          .single();

        if (storeError) throw storeError;

        setVerificationStatus({
          hasApplication: !!verificationData,
          status: verificationData?.status || null,
          isVerified: storeData?.verified || false,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching verification status:', error);
        setVerificationStatus({
          hasApplication: false,
          status: null,
          isVerified: false,
          isLoading: false
        });
      }
    };

    fetchVerificationStatus();
  }, [user, storeId]);

  return verificationStatus;
};
