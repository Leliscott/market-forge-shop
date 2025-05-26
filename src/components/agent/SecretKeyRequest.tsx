
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Key, Send, Loader2 } from 'lucide-react';

const SecretKeyRequest: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requesterName: '',
    requesterEmail: '',
    reason: ''
  });

  const generateSecretKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requesterName || !formData.requesterEmail || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const generatedSecret = generateSecretKey();

      // Insert secret key request
      const { error: insertError } = await supabase
        .from('secret_key_requests')
        .insert({
          requester_email: formData.requesterEmail,
          requester_name: formData.requesterName,
          generated_secret: generatedSecret,
          notes: formData.reason,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Send notification to master agent
      const { error: functionError } = await supabase.functions.invoke('send-secret-key-request', {
        body: {
          requesterEmail: formData.requesterEmail,
          requesterName: formData.requesterName,
          reason: formData.reason,
          generatedSecret: generatedSecret
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        // Don't fail the request if email fails
      }

      toast({
        title: "Request Submitted",
        description: "Your secret key request has been sent to the master agent for review.",
      });

      // Reset form
      setFormData({
        requesterName: '',
        requesterEmail: '',
        reason: ''
      });

    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Request Agent Access
        </CardTitle>
        <CardDescription>
          Submit a request for agent portal access. The master agent will review your request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.requesterName}
              onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.requesterEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, requesterEmail: e.target.value }))}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for Access *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Explain why you need agent access"
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Your request will be reviewed by the master agent. 
            A unique secret key will be generated if approved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecretKeyRequest;
