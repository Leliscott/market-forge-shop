
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Home } from 'lucide-react';
import DashboardStats from '@/components/agent/DashboardStats';
import VerificationRequestsTable from '@/components/agent/VerificationRequestsTable';
import VerificationDialog from '@/components/agent/VerificationDialog';

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
  const { user } = useAuth();
  const [viewingRequest, setViewingRequest] = useState<VerificationRequest | null>(null);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAgent, setCurrentAgent] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchAgentData();
      fetchVerificationRequests();
    }
  }, [user]);

  const fetchAgentData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching agent data:', error);
    } else {
      setCurrentAgent(data);
    }
  };

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_verifications')
        .select('*')
        .order('submission_date', { ascending: false });

      if (error) {
        console.error('Error fetching verification requests:', error);
        toast({
          title: "Error",
          description: "Failed to load verification requests",
          variant: "destructive"
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
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
          processed_by: currentAgent.id,
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
  };
  
  const handleReject = async (requestId: string) => {
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
          processed_by: currentAgent.id,
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
  };

  const filteredRequests = (status: string) => {
    return requests.filter(req => status === 'all' || req.status === status);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <Home className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
          <Home className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardStats agentId={currentAgent?.agent_id} />
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filteredRequests('pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filteredRequests('approved').length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({filteredRequests('rejected').length})</TabsTrigger>
          </TabsList>
          
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Merchant Verification Requests</CardTitle>
                  <CardDescription>
                    Review and manage verification documents from merchants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VerificationRequestsTable 
                    requests={filteredRequests(status)}
                    onViewRequest={setViewingRequest}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
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
