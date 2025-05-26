
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Key, Mail } from 'lucide-react';

const SecretKeyRequest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    reason: ''
  });

  const generateSecretKey = () => {
    return `agent_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const generatedSecret = generateSecretKey();

      // Create secret key request
      const { error: requestError } = await supabase
        .from('secret_key_requests')
        .insert({
          requester_email: formData.email,
          requester_name: formData.name,
          generated_secret: generatedSecret,
          notes: formData.reason
        });

      if (requestError) throw requestError;

      // Send notification email to master agent
      const { error: emailError } = await supabase.functions.invoke('send-secret-key-request', {
        body: {
          requesterEmail: formData.email,
          requesterName: formData.name,
          reason: formData.reason,
          generatedSecret: generatedSecret
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        toast.warning("Request Submitted", {
          description: "Your request was submitted but email notification failed. Please contact support.",
        });
      } else {
        toast.success("Request Submitted Successfully!", {
          description: "Your secret key request has been sent to the master agent for approval.",
        });
      }

      setIsOpen(false);
      setFormData({ email: '', name: '', reason: '' });
    } catch (error: any) {
      console.error('Secret key request failed:', error);
      toast.error("Request Failed", {
        description: error.message || "Failed to submit request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Key className="h-4 w-4" />
        Request Secret Key
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Request Agent Secret Key
            </DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Submit a request for agent access. The master agent will review and approve your request.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="dark:text-gray-200">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="name" className="dark:text-gray-200">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="reason" className="dark:text-gray-200">Reason for Request</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Brief explanation for why you need agent access"
                required
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecretKeyRequest;
