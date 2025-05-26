
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgentLoginValues {
  email: string;
  secretKey: string;
}

export const useAgentAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (data: AgentLoginValues) => {
    setIsLoading(true);
    try {
      console.log('Agent login attempt:', data.email);

      // Check if this is the master agent or validate against agent_secrets
      let isAuthorized = false;
      let secretKey = '';

      if (data.email === 'tshomela23rd@gmail.com') {
        // Master agent - check against stored secret
        const { data: secretData, error: secretError } = await supabase
          .from('agent_secrets')
          .select('secret_key')
          .eq('agent_email', data.email)
          .single();

        if (secretError || !secretData) {
          toast({
            title: "Authentication failed",
            description: "Master agent credentials not found",
            variant: "destructive"
          });
          return;
        }

        isAuthorized = data.secretKey === secretData.secret_key;
        secretKey = secretData.secret_key;
      } else {
        // Regular agent - check if secret exists for this email
        const { data: secretData, error: secretError } = await supabase
          .from('agent_secrets')
          .select('secret_key')
          .eq('agent_email', data.email)
          .single();

        if (secretError || !secretData) {
          toast({
            title: "Authentication failed",
            description: "Agent not authorized for this email",
            variant: "destructive"
          });
          return;
        }

        isAuthorized = data.secretKey === secretData.secret_key;
        secretKey = secretData.secret_key;
      }

      if (!isAuthorized) {
        toast({
          title: "Authentication failed",
          description: "Invalid secret key",
          variant: "destructive"
        });
        return;
      }

      // Check if agent exists in the system
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('email', data.email)
        .single();

      if (agentError || !agentData) {
        // Create agent if doesn't exist (for master agent)
        if (data.email === 'tshomela23rd@gmail.com') {
          const { data: newAgent, error: createError } = await supabase
            .from('agents')
            .insert({
              email: data.email,
              agent_id: 'MASTER_AGENT',
              cellphone: 'N/A'
            })
            .select()
            .single();

          if (createError) {
            toast({
              title: "Error",
              description: "Failed to create master agent record",
              variant: "destructive"
            });
            return;
          }
        } else {
          toast({
            title: "Authentication failed",
            description: "Agent record not found",
            variant: "destructive"
          });
          return;
        }
      }

      // Update last login
      await supabase
        .from('agents')
        .update({ last_login: new Date().toISOString() })
        .eq('email', data.email);

      // Store agent session in localStorage
      localStorage.setItem('agentSession', JSON.stringify({
        email: data.email,
        agentId: agentData?.agent_id || 'MASTER_AGENT',
        isMaster: data.email === 'tshomela23rd@gmail.com',
        loginTime: new Date().toISOString()
      }));

      toast({
        title: "Authentication successful",
        description: `Welcome${data.email === 'tshomela23rd@gmail.com' ? ', Master Agent' : ' to the Agent Portal'}`,
      });
      
      navigate('/agent/dashboard');
    } catch (error) {
      console.error('Agent authentication error:', error);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
};
