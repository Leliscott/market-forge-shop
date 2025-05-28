
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DashboardStats from '@/components/agent/DashboardStats';
import VerificationDialog from '@/components/agent/VerificationDialog';
import DashboardHeader from '@/components/agent/dashboard/DashboardHeader';
import DashboardTabs from '@/components/agent/dashboard/DashboardTabs';
import { useAgentDashboard } from '@/components/agent/dashboard/useAgentDashboard';

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

const AgentDashboard = () => {
  const { toast } = useToast();
  const [viewingRequest, setViewingRequest] = useState<VerificationRequest | null>(null);

  const {
    requests,
    orders,
    secretKeyRequests,
    loading,
    ordersLoading,
    secretKeysLoading,
    currentAgent,
    searchTerm,
    setSearchTerm,
    setCurrentAgent,
    fetchVerificationRequests,
    fetchOrders,
    fetchSecretKeyRequests,
    handleMarkOrderDelivered,
    handleApproveSecretKey,
    handleRejectSecretKey
  } = useAgentDashboard();

  useEffect(() => {
    // Check agent session
    const agentSession = localStorage.getItem('agentSession');
    if (!agentSession) {
      window.location.href = '/';
      return;
    }

    const session = JSON.parse(agentSession);
    if (!session.isMaster) {
      localStorage.removeItem('agentSession');
      window.location.href = '/';
      return;
    }
    
    setCurrentAgent(session);
    
    fetchVerificationRequests();
    fetchOrders();
    fetchSecretKeyRequests();

    // Auto-refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleApprove(requestId: string) {
    if (!currentAgent) {
      toast({
        title: "Error",
        description: "Agent information not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Update verification request
      const { error: verificationError } = await supabase
        .from('merchant_verifications')
        .update({
          status: 'approved',
          processed_by: currentAgent.agentId,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (verificationError) {
        throw verificationError;
      }

      // Update store verification status
      const { error: storeError } = await supabase
        .from('stores')
        .update({ verified: true })
        .eq('id', request.store_id);

      if (storeError) {
        throw storeError;
      }

      toast({
        title: "Merchant verified",
        description: "The merchant has been successfully verified",
      });
      
      setViewingRequest(null);
      fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error approving merchant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve merchant",
        variant: "destructive"
      });
    }
  }
  
  async function handleReject(requestId: string) {
    if (!currentAgent) {
      toast({
        title: "Error",
        description: "Agent information not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({
          status: 'rejected',
          processed_by: currentAgent.agentId,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      toast({
        title: "Merchant rejected",
        description: "The verification request has been rejected",
      });
      
      setViewingRequest(null);
      fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error rejecting merchant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject merchant",
        variant: "destructive"
      });
    }
  }

  if (loading && ordersLoading && secretKeysLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader currentAgent={currentAgent} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Loading Agent Dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader currentAgent={currentAgent} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers, sellers, orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DashboardStats agentId={currentAgent?.agentId} />
        
        <DashboardTabs
          orders={orders}
          secretKeyRequests={secretKeyRequests}
          requests={requests}
          ordersLoading={ordersLoading}
          secretKeysLoading={secretKeysLoading}
          onMarkOrderDelivered={handleMarkOrderDelivered}
          onViewOrderDetails={() => {}}
          onApproveSecretKey={handleApproveSecretKey}
          onRejectSecretKey={handleRejectSecretKey}
          onViewRequest={setViewingRequest}
        />
      </main>
      
      <VerificationDialog 
        request={viewingRequest}
        onClose={() => setViewingRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AgentDashboard;
