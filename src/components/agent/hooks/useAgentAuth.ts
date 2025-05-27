
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

      // Only allow master agent email
      if (data.email !== 'tshomela23rd@gmail.com') {
        toast({
          title: "Access Denied",
          description: "Only the master agent is authorized to access this portal",
          variant: "destructive"
        });
        return;
      }

      // Check master agent credentials
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

      const isAuthorized = data.secretKey === secretData.secret_key;

      if (!isAuthorized) {
        toast({
          title: "Authentication failed",
          description: "Invalid secret key",
          variant: "destructive"
        });
        return;
      }

      // Check if master agent exists in the system
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('email', data.email)
        .single();

      if (agentError || !agentData) {
        // Create master agent if doesn't exist
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
      }

      // Update last login
      await supabase
        .from('agents')
        .update({ last_login: new Date().toISOString() })
        .eq('email', data.email);

      // Store master agent session
      localStorage.setItem('agentSession', JSON.stringify({
        email: data.email,
        agentId: 'MASTER_AGENT',
        isMaster: true,
        loginTime: new Date().toISOString()
      }));

      toast({
        title: "Master Agent Access Granted",
        description: "Welcome to the Agent Portal",
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
