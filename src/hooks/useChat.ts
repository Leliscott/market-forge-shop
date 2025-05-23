
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Chat {
  id: string;
  customer_id: string;
  seller_id: string;
  store_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  store: {
    name: string;
    logo?: string;
  };
  customer_profile?: {
    name?: string;
    email?: string;
  };
  seller_profile?: {
    name?: string;
    email?: string;
  };
  last_message?: {
    content: string;
    sender_id: string;
  };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          stores!chats_store_id_fkey(name, logo),
          customer_profile:profiles!chats_customer_id_fkey(name, email),
          seller_profile:profiles!chats_seller_id_fkey(name, email)
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get last message for each chat
      const chatsWithMessages = await Promise.all(
        (data || []).map(async (chat) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, sender_id')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...chat,
            store: chat.stores,
            last_message: lastMessage
          };
        })
      );

      setChats(chatsWithMessages);
    } catch (error: any) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrGetChat = async (storeId: string, sellerId: string) => {
    if (!user) return null;

    try {
      // Check if chat already exists
      const { data: existingChat, error: checkError } = await supabase
        .from('chats')
        .select('*')
        .eq('customer_id', user.id)
        .eq('seller_id', sellerId)
        .eq('store_id', storeId)
        .single();

      if (existingChat && !checkError) {
        return existingChat.id;
      }

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert({
          customer_id: user.id,
          seller_id: sellerId,
          store_id: storeId
        })
        .select()
        .single();

      if (createError) throw createError;

      return newChat.id;
    } catch (error: any) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return {
    chats,
    isLoading,
    fetchChats,
    createOrGetChat
  };
};
