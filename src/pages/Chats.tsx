
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatsList from '@/components/chat/ChatsList';
import ChatWindow from '@/components/chat/ChatWindow';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const Chats: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');
  const { isMobile } = useResponsiveLayout();

  const handleChatSelect = (chatId: string, storeName: string) => {
    setSelectedChatId(chatId);
    setSelectedStoreName(storeName);
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setSelectedStoreName('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <ResponsiveContainer>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Chats</h1>
          
          <div className={`grid gap-6 sm:gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            <div className={selectedChatId && isMobile ? 'hidden' : 'block'}>
              <ChatsList onChatSelect={handleChatSelect} />
            </div>
            
            <div className={`${isMobile ? 'fixed inset-0 z-50 bg-background' : 'lg:sticky lg:top-8'}`}>
              {selectedChatId ? (
                <div className={`border rounded-lg ${isMobile ? 'h-screen' : 'h-96'}`}>
                  <ChatWindow
                    chatId={selectedChatId}
                    storeName={selectedStoreName}
                    onClose={handleCloseChat}
                  />
                </div>
              ) : (
                <div className={`border rounded-lg ${isMobile ? 'h-64' : 'h-96'} flex items-center justify-center text-muted-foreground`}>
                  Select a chat to start messaging
                </div>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chats;
