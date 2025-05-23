
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, UserX, Clock, Eye, CheckCheck, ShieldAlert, Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
      fetchVerificationRequests(); // Refresh the list
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
      fetchVerificationRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Error rejecting merchant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject merchant",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><UserX className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const filteredRequests = (status: string) => {
    return requests.filter(req => status === 'all' || req.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="bg-white border-b px-4 py-2">
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
      <div className="bg-white border-b px-4 py-2">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
          <Home className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ShieldAlert className="mr-2 h-6 w-6" />
              Agent Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage merchant verification requests
            </p>
          </div>
          
          <Button variant="outline">
            Agent ID: {currentAgent?.agent_id || 'Loading...'}
          </Button>
        </div>
        
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
                  {filteredRequests(status).length > 0 ? (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-3 px-4">Merchant</th>
                            <th className="text-left py-3 px-4">Owner</th>
                            <th className="text-left py-3 px-4">Submission Date</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests(status).map((request, index) => (
                            <tr key={request.id} className={index !== filteredRequests(status).length - 1 ? "border-b" : ""}>
                              <td className="py-3 px-4">{request.merchant_name}</td>
                              <td className="py-3 px-4">{request.owner_name}</td>
                              <td className="py-3 px-4">{formatDate(request.submission_date)}</td>
                              <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                              <td className="py-3 px-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setViewingRequest(request)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No {status === 'all' ? '' : status} verification requests found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      {/* Verification Request Dialog */}
      {viewingRequest && (
        <Dialog open={!!viewingRequest} onOpenChange={open => !open && setViewingRequest(null)}>
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
                  <p><strong>Store Name:</strong> {viewingRequest.merchant_name}</p>
                  <p><strong>Owner Name:</strong> {viewingRequest.owner_name}</p>
                  <p><strong>Submission Date:</strong> {formatDate(viewingRequest.submission_date)}</p>
                  <p><strong>Status:</strong> {viewingRequest.status}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Verification Documents</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1">South African ID Document:</p>
                      <img 
                        src={viewingRequest.id_document_url} 
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
                        src={viewingRequest.selfie_url} 
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
              {viewingRequest.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(viewingRequest.id)}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  
                  <Button 
                    onClick={() => handleApprove(viewingRequest.id)}
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </>
              )}
              
              {viewingRequest.status !== 'pending' && (
                <Button variant="outline" onClick={() => setViewingRequest(null)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AgentDashboard;
