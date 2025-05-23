
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AgentLoginValues, ForgotIdValues } from '../schemas/agentSchemas';

export const useAgentAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateAgentId = () => {
    return `AG-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const handleLogin = async (data: AgentLoginValues) => {
    setIsLoading(true);
    try {
      // Check if this is a registration (no agent ID provided)
      if (!data.agentId) {
        // Register new agent
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          toast({
            title: "Registration failed",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        if (authData.user) {
          const agentId = generateAgentId();
          
          // Create agent record
          const { error: agentError } = await supabase
            .from('agents')
            .insert({
              user_id: authData.user.id,
              agent_id: agentId,
              email: data.email,
              cellphone: data.cellphone,
            });

          if (agentError) {
            toast({
              title: "Agent registration failed",
              description: agentError.message,
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "Agent registration successful",
            description: `Your Agent ID is ${agentId}. Please save this for future logins.`,
          });
        }
      } else {
        // Login existing agent
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          toast({
            title: "Login failed",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        // Verify agent ID
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('agent_id', data.agentId)
          .eq('user_id', authData.user?.id)
          .single();

        if (agentError || !agentData) {
          toast({
            title: "Invalid Agent ID",
            description: "The provided Agent ID does not match your account",
            variant: "destructive"
          });
          return;
        }

        // Update last login
        await supabase
          .from('agents')
          .update({ last_login: new Date().toISOString() })
          .eq('id', agentData.id);

        toast({
          title: "Agent authentication successful",
          description: "Welcome to the Agent Portal",
        });
      }
      
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

  const handleForgotId = async (data: ForgotIdValues) => {
    setIsLoading(true);
    try {
      // Find agent by email
      const { data: agentData, error } = await supabase
        .from('agents')
        .select('agent_id')
        .eq('email', data.email)
        .single();

      if (error || !agentData) {
        toast({
          title: "Email not found",
          description: "No agent account found with this email address",
          variant: "destructive"
        });
        return;
      }

      // In a real implementation, you would send an email with the agent ID
      // For now, we'll just show it in a toast
      toast({
        title: "Agent ID Found",
        description: `Your Agent ID is: ${agentData.agent_id}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
    handleForgotId,
  };
};
