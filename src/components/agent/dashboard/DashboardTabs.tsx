
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrderApprovalTable from '@/components/agent/OrderApprovalTable';
import SecretKeyRequestsTable from '@/components/agent/SecretKeyRequestsTable';
import VerificationRequestsTable from '@/components/agent/VerificationRequestsTable';

interface Order {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  status: string;
  email_payments?: {
    payment_confirmed: boolean;
    email_sent_at: string;
  };
}

interface SecretKeyRequest {
  id: string;
  requester_email: string;
  requester_name: string;
  generated_secret: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
}

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

interface DashboardTabsProps {
  orders: Order[];
  secretKeyRequests: SecretKeyRequest[];
  requests: VerificationRequest[];
  ordersLoading: boolean;
  secretKeysLoading: boolean;
  onApprovePayment: (orderId: string) => void;
  onRejectPayment: (orderId: string) => void;
  onViewOrderDetails: (order: Order) => void;
  onApproveSecretKey: (requestId: string, email: string, secret: string) => void;
  onRejectSecretKey: (requestId: string) => void;
  onViewRequest: (request: VerificationRequest) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  orders,
  secretKeyRequests,
  requests,
  ordersLoading,
  secretKeysLoading,
  onApprovePayment,
  onRejectPayment,
  onViewOrderDetails,
  onApproveSecretKey,
  onRejectSecretKey,
  onViewRequest
}) => {
  const pendingOrders = orders.filter(order => 
    order.payment_method === 'email' && !order.email_payments?.payment_confirmed
  );

  const filteredRequests = (status: string) => {
    return requests.filter(req => status === 'all' || req.status === status);
  };

  return (
    <Tabs defaultValue="orders" className="space-y-4">
      <TabsList>
        <TabsTrigger value="orders" className="relative">
          Email Orders
          {pendingOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="secret-keys">
          Secret Key Requests ({secretKeyRequests.filter(r => r.status === 'pending').length})
        </TabsTrigger>
        <TabsTrigger value="verifications">
          Merchant Verifications ({requests.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="orders" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Email Payment Orders 
              {pendingOrders.length > 0 && (
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                  {pendingOrders.length} Pending
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Review and approve email payment orders. All notifications sent via Resend SMTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderApprovalTable 
              orders={orders}
              onApprove={onApprovePayment}
              onReject={onRejectPayment}
              onViewDetails={onViewOrderDetails}
              loading={ordersLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="secret-keys" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Secret Key Requests</CardTitle>
            <CardDescription>
              Manage agent access requests and approve/reject secret keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecretKeyRequestsTable 
              requests={secretKeyRequests}
              onApprove={onApproveSecretKey}
              onReject={onRejectSecretKey}
              loading={secretKeysLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="verifications" className="space-y-4">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <Card key={status}>
            <CardHeader>
              <CardTitle>
                {status.charAt(0).toUpperCase() + status.slice(1)} Merchant Verifications
              </CardTitle>
              <CardDescription>
                Review and manage verification documents from merchants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationRequestsTable 
                requests={filteredRequests(status)}
                onViewRequest={onViewRequest}
              />
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
