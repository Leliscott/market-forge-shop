
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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

      // Validate secret key against MASTER_KEY from Supabase secrets
      const { data: secretValidation, error: secretError } = await supabase.functions.invoke('validate-master-key', {
        body: { secretKey: data.secretKey }
      });

      if (secretError || !secretValidation?.isValid) {
        toast({
          title: "Authentication failed",
          description: "Invalid master secret key",
          variant: "destructive"
        });
        return;
      }

      // Generate a unique agent ID based on email
      const agentId = `AGENT_${data.email.split('@')[0].toUpperCase()}`;

      // Check if agent exists in the system
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('email', data.email)
        .single();

      if (agentError && agentError.code === 'PGRST116') {
        // Agent doesn't exist, create new agent record
        const { data: newAgent, error: createError } = await supabase
          .from('agents')
          .insert({
            email: data.email,
            agent_id: agentId,
            cellphone: 'N/A'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating agent:', createError);
          toast({
            title: "Error",
            description: "Failed to create agent record",
            variant: "destructive"
          });
          return;
        }

        console.log('New agent created:', newAgent);
      } else if (agentError) {
        console.error('Error checking agent:', agentError);
        toast({
          title: "Error",
          description: "Failed to verify agent status",
          variant: "destructive"
        });
        return;
      }

      // Update last login
      await supabase
        .from('agents')
        .update({ last_login: new Date().toISOString() })
        .eq('email', data.email);

      // Store agent session
      localStorage.setItem('agentSession', JSON.stringify({
        email: data.email,
        agentId: agentId,
        isMaster: true,
        loginTime: new Date().toISOString()
      }));

      toast({
        title: "Agent Access Granted",
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
