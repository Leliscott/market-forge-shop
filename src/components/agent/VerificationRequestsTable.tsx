
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, UserX, Clock, Eye } from 'lucide-react';

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

interface VerificationRequestsTableProps {
  requests: VerificationRequest[];
  onViewRequest: (request: VerificationRequest) => void;
}

const VerificationRequestsTable: React.FC<VerificationRequestsTableProps> = ({
  requests,
  onViewRequest
}) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No verification requests found</p>
      </div>
    );
  }

  return (
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
          {requests.map((request, index) => (
            <tr key={request.id} className={index !== requests.length - 1 ? "border-b" : ""}>
              <td className="py-3 px-4">{request.merchant_name}</td>
              <td className="py-3 px-4">{request.owner_name}</td>
              <td className="py-3 px-4">{formatDate(request.submission_date)}</td>
              <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
              <td className="py-3 px-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewRequest(request)}
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
  );
};

export default VerificationRequestsTable;
