
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ChatsListProps {
  onChatSelect: (chatId: string, storeName: string) => void;
}

const ChatsList: React.FC<ChatsListProps> = ({ onChatSelect }) => {
  const { user } = useAuth();
  const { chats, isLoading } = useChat();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading chats...</div>
        </CardContent>
      </Card>
    );
  }

  if (chats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No chats yet. Start chatting with sellers!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chats ({chats.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {chats.map((chat) => {
            const otherUser = chat.customer_id === user?.id 
              ? chat.seller_profile 
              : chat.customer_profile;
            const isCustomer = chat.customer_id === user?.id;

            return (
              <div
                key={chat.id}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onChatSelect(chat.id, chat.store.name)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={chat.store.logo} />
                    <AvatarFallback>
                      {chat.store.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{chat.store.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {isCustomer ? 'Seller' : 'Customer'}: {otherUser?.name || otherUser?.email || 'Unknown'}
                    </p>
                    {chat.last_message && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {chat.last_message.sender_id === user?.id ? 'You: ' : ''}
                        {chat.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatsList;
