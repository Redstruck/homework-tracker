
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../lib/types';
import { getAIResponse, generateId } from '../lib/aiHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';

interface ChatInterfaceProps {
  onExit: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: 'How can I help with your studies today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const userMessage = userInput;
    setUserInput('');
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: generateId(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(userMessage);
      
      // Limit response length to about 150-200 words
      let limitedResponse = response;
      const words = response.split(' ');
      if (words.length > 180) {
        limitedResponse = words.slice(0, 180).join(' ') + '...';
      }
      
      // Add AI response to chat
      const newAIMessage: ChatMessage = {
        id: generateId(),
        content: limitedResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: 'Sorry, I had trouble processing that. Could you try again?',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="py-3 px-4 border-b flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onExit}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium">QuickNotes Assistant</h2>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-blue-50 text-gray-900' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-3 flex gap-2"
      >
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !userInput.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
