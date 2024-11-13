// components/DebateInterface.tsx
'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

interface ApiResponse {
  assistant_response: string;
}

const DebateInterface: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatHistoryToList = (messages: Message[]): string[] => {
    if (messages.length === 0) return [];
    return messages.map(msg => msg.content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;

    setIsLoading(true);
    const newMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    // Update messages immediately with user input
    setMessages(prev => [...prev, newMessage]);


    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_input: userInput,
          recent_history: formatHistoryToList(messages) // Now returns string[]
        }),
      });
      
      const data: ApiResponse = await response.json();
      console.log(data)
      const botMessage: Message = {
        role: 'bot',
        content: data.assistant_response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
      }]);
    }

    setIsLoading(false);
    setUserInput('');
  };

  const handleNewDebate = () => {
    setMessages([]);
    setUserInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              Start a debate by typing your argument below!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-12'
                    : 'bg-gray-100 mr-12'
                }`}
              >
                <div>{message.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp?.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-center text-gray-500">
              Thinking...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            rows={3}
            value={userInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setUserInput(e.target.value)
            }
            placeholder="Enter your argument..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setUserInput(userInput + '\n');
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleNewDebate}
          >
            New Debate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebateInterface;