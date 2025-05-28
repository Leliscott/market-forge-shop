
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAgentAuth } from './hooks/useAgentAuth';
import { useDoubleTap } from './hooks/useDoubleTap';
import AgentLoginForm from './forms/AgentLoginForm';

const AgentPortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, handleLogin } = useAgentAuth();
  
  const handleDoubleTap = useDoubleTap(() => {
    setIsOpen(true);
  });

  const onLogin = async (data: any) => {
    await handleLogin(data);
    setIsOpen(false);
  };

  return (
    <>
      <div className="mt-12 mb-2 py-4 border-t border-b text-center dark:border-gray-700">
        <div 
          className="text-xs text-muted-foreground cursor-pointer"
          onClick={handleDoubleTap}
        >
          © 2025 Shop4ll. All rights reserved.
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Agent Portal</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Access for authorized agents with valid master key.
              <br />
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Enter your email and the master secret key to access the portal.
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <AgentLoginForm
            onSubmit={onLogin}
            isLoading={isLoading}
          />
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Any user with the correct master key can access the agent portal.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentPortal;
