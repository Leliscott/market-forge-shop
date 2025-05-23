
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface DashboardStatsProps {
  agentId?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ agentId }) => {
  return (
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
        Agent ID: {agentId || 'Loading...'}
      </Button>
    </div>
  );
};

export default DashboardStats;
