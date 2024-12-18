// src/hooks/useChat.ts

import { useState, useCallback } from 'react';
import { chatApi, sessionApi } from '../services/api';
import type { Message } from '../types/chat';
import { useAuthStore } from '../store/authStore';

export function useChat(sessionId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Helper function to format messages
  const formatMessage = useCallback((text: string): string => {
    return text.trim()
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/```(\w+)?\n/g, '```$1\n') // Preserve code block formatting
      .trim();
  }, []);

  // Send message function
  const sendMessage = async (input: string): Promise<number | null> => {
    if (!input.trim() || isLoading) return null;

    const userMessage = { question: input, answer: '' };

    // Add the user message to the messages array
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the API to get the bot's response
      const response = await chatApi.sendMessage(input, sessionId ?? undefined);
      
      // Format both user question and bot answer
      const formattedResponse = formatMessage(response.answer);
      
      // Update the message array with the formatted bot response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the placeholder user message
        { 
          question: formatMessage(input), // Format the user's input
          answer: formattedResponse, // Format the bot's response
        },
      ]);

      // If no sessionId, refresh sessions after creating a new chat
      if (!sessionId && user?.user_id) {
        const sessionsResponse = await sessionApi.getUserSessions();
        window.dispatchEvent(new CustomEvent('sessionsUpdated', { 
          detail: sessionsResponse.sessions 
        }));
        return sessionsResponse.sessions[sessionsResponse.sessions.length - 1].id;
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove user message
        { question: input, answer: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
    return null;
  };  

  // Load session messages
  const loadSessionMessages = useCallback(async (sessionId: number) => {
    setIsLoading(true);
    try {
      const response = await sessionApi.getSessionMessages(sessionId);
      const formattedMessages = response.qa_pairs.map((qa: { question: string; answer: string; }) => ({
        question: formatMessage(qa.question),
        answer: formatMessage(qa.answer),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load session messages:', error);
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  }, [formatMessage]);

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    loadSessionMessages,
    clearMessages,
  };
}