
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, UserX, User, Clock, Eye, CheckCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AgentPortal from '@/components/agent/AgentPortal';

// Mock data for verification requests
const mockVerificationRequests = [
  {
    id: '1',
    merchantName: 'Tech Gadgets Store',
    storeId: 'store-1',
    ownerName: 'John Smith',
    submissionDate: '2023-06-15',
    status: 'pending',
    documents: {
      idDocument: 'https://example.com/id-document.jpg',
      selfieWithId: 'https://example.com/selfie.jpg'
    }
  },
  {
    id: '2',
    merchantName: 'Fashion Boutique',
    storeId: 'store-2',
    ownerName: 'Sarah Johnson',
    submissionDate: '2023-06-14',
    status: 'pending',
    documents: {
      idDocument: 'https://example.com/id-document2.jpg',
      selfieWithId: 'https://example.com/selfie2.jpg'
    }
  },
  {
    id: '3',
    merchantName: 'Home Decor Plus',
    storeId: 'store-3',
    ownerName: 'Michael Brown',
    submissionDate: '2023-06-12',
    status: 'approved',
    documents: {
      idDocument: 'https://example.com/id-document3.jpg',
      selfieWithId: 'https://example.com/selfie3.jpg'
    }
  },
  {
    id: '4',
    merchantName: 'Kitchen Supplies Co.',
    storeId: 'store-4',
    ownerName: 'Emily Wilson',
    submissionDate: '2023-06-10',
    status: 'rejected',
    documents: {
      idDocument: 'https://example.com/id-document4.jpg',
      selfieWithId: 'https://example.com/selfie4.jpg'
    }
  }
];

const AgentDashboard = () => {
  const { toast } = useToast();
  const [viewingRequest, setViewingRequest] = useState<any>(null);
  const [requests, setRequests] = useState(mockVerificationRequests);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    
    toast({
      title: "Merchant verified",
      description: "The merchant has been successfully verified",
    });
    
    setViewingRequest(null);
  };
  
  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    
    toast({
      title: "Merchant rejected",
      description: "The verification request has been rejected",
    });
    
    setViewingRequest(null);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
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
            Agent ID: AG-{Math.floor(10000 + Math.random() * 90000)}
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                              <td className="py-3 px-4">{request.merchantName}</td>
                              <td className="py-3 px-4">{request.ownerName}</td>
                              <td className="py-3 px-4">{request.submissionDate}</td>
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
      
      <AgentPortal />
      <Footer />
      
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
                  <p><strong>Store Name:</strong> {viewingRequest.merchantName}</p>
                  <p><strong>Owner Name:</strong> {viewingRequest.ownerName}</p>
                  <p><strong>Submission Date:</strong> {viewingRequest.submissionDate}</p>
                  <p><strong>Status:</strong> {viewingRequest.status}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Verification Documents</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1">South African ID Document:</p>
                      <img 
                        src={viewingRequest.documents.idDocument} 
                        alt="ID Document" 
                        className="h-40 w-full object-cover rounded-md border" 
                      />
                    </div>
                    <div>
                      <p className="mb-1">Selfie with ID:</p>
                      <img 
                        src={viewingRequest.documents.selfieWithId} 
                        alt="Selfie with ID" 
                        className="h-40 w-full object-cover rounded-md border" 
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
