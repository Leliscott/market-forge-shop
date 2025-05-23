
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import ChatWindow from './ChatWindow';

interface ChatWithSellerProps {
  storeId: string;
  storeName: string;
  sellerId: string;
}

const ChatWithSeller: React.FC<ChatWithSellerProps> = ({ 
  storeId, 
  storeName, 
  sellerId 
}) => {
  const { user } = useAuth();
  const { createOrGetChat } = useChat();
  const [chatId, setChatId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChat = async () => {
    if (!user) return;
    
    const newChatId = await createOrGetChat(storeId, sellerId);
    if (newChatId) {
      setChatId(newChatId);
      setIsOpen(true);
      // Dispatch event to hide global chat button
      window.dispatchEvent(new CustomEvent('chatWindowOpen'));
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setChatId(null);
    // Dispatch event to show global chat button
    window.dispatchEvent(new CustomEvent('chatWindowClose'));
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (isOpen) {
        window.dispatchEvent(new CustomEvent('chatWindowClose'));
      }
    };
  }, [isOpen]);

  return (
    <>
      <Button 
        onClick={handleStartChat} 
        className="w-full gap-2"
        variant="outline"
      >
        <MessageCircle className="w-4 h-4" />
        Chat with Seller
      </Button>

      {isOpen && chatId && (
        <ChatWindow
          chatId={chatId}
          storeName={storeName}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export default ChatWithSeller;
