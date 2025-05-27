
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface DashboardHeaderProps {
  currentAgent: { email: string } | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentAgent }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
      <div className="flex justify-between items-center">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
          <Home className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <div className="text-sm text-gray-600">
          Master Agent: {currentAgent?.email}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
