
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../lib/types';
import { generateId } from '../lib/aiHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Image } from 'lucide-react';
import { useHandleStreamResponse } from '../lib/useHandleStreamResponse';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  onExit: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: 'How can I help with your tasks today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: (message) => {
      console.log("Streaming chunk received:", message);
      setStreamingMessage(message);
    },
    onFinish: (message) => {
      console.log("Final message received:", message);
      const newAIMessage: ChatMessage = {
        id: generateId(),
        content: message,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setStreamingMessage('');
      setIsLoading(false);
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImageMessage: ChatMessage = {
        id: generateId(),
        content: reader.result as string,
        sender: 'user',
        timestamp: new Date(),
        isImage: true
      };
      setMessages(prev => [...prev, newImageMessage]);

      // Inform the user we can't process images with the current integration
      handleAIResponse("I see you've uploaded an image, but our current ChatGPT integration doesn't support image analysis. Can I help you with something else?");
    };
    reader.readAsDataURL(file);
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending request to ChatGPT with message:", userMessage);
      
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful homework assistant. Help the student understand their assignments and provide guidance. Keep responses concise, under 200 words."
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ],
          stream: true,
        }),
      });
      
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      handleStreamResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Connection Error",
        description: "Sorry, I had trouble connecting to ChatGPT. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    
    const userMessage = userInput;
    setUserInput('');
    
    const newUserMessage: ChatMessage = {
      id: generateId(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    await handleAIResponse(userMessage);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="py-3 px-4 border-b flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={onExit}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium">Homework Assistant</h2>
      </div>
      
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
              {message.isImage ? (
                <img 
                  src={message.content} 
                  alt="User uploaded"
                  className="max-w-full rounded"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-lg p-3 bg-gray-100 text-gray-900">
              <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-3 flex gap-2"
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-4 w-4" />
        </Button>
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
