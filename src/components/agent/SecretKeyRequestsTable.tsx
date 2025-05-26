
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface SecretKeyRequestsTableProps {
  requests: SecretKeyRequest[];
  onApprove: (requestId: string, email: string, secret: string) => void;
  onReject: (requestId: string) => void;
  loading: boolean;
}

const SecretKeyRequestsTable: React.FC<SecretKeyRequestsTableProps> = ({
  requests,
  onApprove,
  onReject,
  loading
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading secret key requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center py-4 text-gray-500">No secret key requests found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Requester</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Reason</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Requested</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-3">
                <div className="font-medium">{request.requester_name || 'N/A'}</div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  {request.requester_email}
                </div>
              </td>
              <td className="p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                  {request.notes || 'No reason provided'}
                </div>
              </td>
              <td className="p-3">
                {getStatusBadge(request.status)}
              </td>
              <td className="p-3 text-sm text-gray-500">
                {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
              </td>
              <td className="p-3">
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(request.id, request.requester_email, request.generated_secret)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(request.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {request.status !== 'pending' && (
                  <span className="text-sm text-gray-500">
                    {request.processed_at && `Processed ${formatDistanceToNow(new Date(request.processed_at), { addSuffix: true })}`}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecretKeyRequestsTable;
