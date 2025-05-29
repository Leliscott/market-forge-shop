
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAgentActions = (currentAgent: any, refreshData: () => void) => {
  const { toast } = useToast();

  const handleMarkOrderDelivered = async (orderId: string) => {
    try {
      console.log('Marking order as delivered:', orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          payment_status: 'completed'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: "Order marked as delivered and seller account updated",
      });
      
      refreshData();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const handleApproveSecretKey = async (requestId: string, email: string, secret: string) => {
    try {
      await supabase
        .from('secret_key_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: currentAgent?.email
        })
        .eq('id', requestId);

      await supabase
        .from('agent_secrets')
        .insert({
          agent_email: email,
          secret_key: secret,
          created_by: currentAgent?.email
        });

      toast({
        title: "Secret Key Approved",
        description: `Agent access granted for ${email}`,
      });
      
      refreshData();
    } catch (error: any) {
      console.error('Error approving secret key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve secret key",
        variant: "destructive"
      });
    }
  };

  const handleRejectSecretKey = async (requestId: string) => {
    try {
      await supabase
        .from('secret_key_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: currentAgent?.email
        })
        .eq('id', requestId);

      toast({
        title: "Secret Key Rejected",
        description: "Request has been rejected",
      });
      
      refreshData();
    } catch (error: any) {
      console.error('Error rejecting secret key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject secret key",
        variant: "destructive"
      });
    }
  };

  return {
    handleMarkOrderDelivered,
    handleApproveSecretKey,
    handleRejectSecretKey
  };
};
