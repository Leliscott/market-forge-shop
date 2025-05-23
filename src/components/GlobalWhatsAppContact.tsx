
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';

const GlobalChatButton: React.FC = () => {
  const { user } = useAuth();
  const { chats } = useChat();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // Count unread chats (chats with messages where user is not the last sender)
  const unreadCount = chats.filter(chat => {
    return chat.last_message && chat.last_message.sender_id !== user?.id;
  }).length;

  useEffect(() => {
    // Listen for chat window open/close events
    const handleChatOpen = () => setIsVisible(false);
    const handleChatClose = () => setIsVisible(true);

    window.addEventListener('chatWindowOpen', handleChatOpen);
    window.addEventListener('chatWindowClose', handleChatClose);

    return () => {
      window.removeEventListener('chatWindowOpen', handleChatOpen);
      window.removeEventListener('chatWindowClose', handleChatClose);
    };
  }, []);

  // Hide button if on chats page or if not visible due to open chat window
  if (!isVisible || location.pathname === '/chats') return null;

  return (
    <Link 
      to="/chats"
      className="fixed bottom-4 right-4 z-50"
    >
      <button
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transition-colors relative"
        aria-label="View your chats"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full"
          >
            {unreadCount}
          </Badge>
        )}
      </button>
    </Link>
  );
};

export default GlobalChatButton;
