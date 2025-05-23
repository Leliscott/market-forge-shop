
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatsList from '@/components/chat/ChatsList';
import ChatWindow from '@/components/chat/ChatWindow';

const Chats: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');

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
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Chats</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ChatsList onChatSelect={handleChatSelect} />
              </div>
              
              <div className="lg:sticky lg:top-8">
                {selectedChatId ? (
                  <div className="border rounded-lg h-96">
                    <ChatWindow
                      chatId={selectedChatId}
                      storeName={selectedStoreName}
                      onClose={handleCloseChat}
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg h-96 flex items-center justify-center text-muted-foreground">
                    Select a chat to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chats;
