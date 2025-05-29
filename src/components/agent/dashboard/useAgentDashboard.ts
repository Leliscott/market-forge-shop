
import { useState } from 'react';
import { useAgentData } from '@/hooks/useAgentData';
import { useAgentActions } from '@/hooks/useAgentActions';

export const useAgentDashboard = () => {
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    requests,
    orders,
    secretKeyRequests,
    loading,
    ordersLoading,
    secretKeysLoading,
    fetchVerificationRequests,
    fetchOrders,
    fetchSecretKeyRequests
  } = useAgentData();

  const refreshData = () => {
    fetchVerificationRequests();
    fetchOrders();
    fetchSecretKeyRequests();
  };

  const {
    handleMarkOrderDelivered,
    handleApproveSecretKey,
    handleRejectSecretKey
  } = useAgentActions(currentAgent, refreshData);

  // Filter data based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_details?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_details?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request =>
    request.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    requests: filteredRequests,
    orders: filteredOrders,
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
  };
};
