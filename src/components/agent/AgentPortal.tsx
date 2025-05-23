
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAgentAuth } from './hooks/useAgentAuth';
import { useDoubleTap } from './hooks/useDoubleTap';
import AgentLoginForm from './forms/AgentLoginForm';
import ForgotIdForm from './forms/ForgotIdForm';

const AgentPortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [forgotIdMode, setForgotIdMode] = useState(false);
  const [idSent, setIdSent] = useState(false);
  
  const { isLoading, handleLogin, handleForgotId } = useAgentAuth();
  
  const handleDoubleTap = useDoubleTap(() => {
    setIsOpen(true);
  });

  const onLogin = async (data: any) => {
    await handleLogin(data);
    setIsOpen(false);
  };

  const onForgotIdSubmit = async (data: any) => {
    const success = await handleForgotId(data);
    if (success) {
      setIdSent(true);
    }
    return success;
  };

  const handleBackToLogin = () => {
    setIdSent(false);
    setForgotIdMode(false);
  };

  return (
    <>
      <div className="mt-12 mb-2 py-4 border-t border-b text-center dark:border-gray-700">
        <div 
          className="text-xs text-muted-foreground cursor-pointer"
          onClick={handleDoubleTap}
        >
          © 2025 ShopMarket. All rights reserved.
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Agent Portal</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {forgotIdMode 
                ? 'Enter your email to retrieve your Agent ID' 
                : 'Enter your credentials to access the agent dashboard.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {idSent ? (
            <div className="space-y-4">
              <p className="text-sm text-green-600 dark:text-green-400">Agent ID has been sent to your email address.</p>
              <Button 
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          ) : forgotIdMode ? (
            <ForgotIdForm
              onSubmit={onForgotIdSubmit}
              onBack={() => setForgotIdMode(false)}
              isLoading={isLoading}
            />
          ) : (
            <AgentLoginForm
              onSubmit={onLogin}
              onForgotId={() => setForgotIdMode(true)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentPortal;
