import { useState, useEffect } from 'react';
import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import { SessionsSidebar } from './chat/SessionsSidebar';
import { sessionApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useChat } from '../hooks/useChat';
import type { Session } from '../types/session';

export function ChatScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const { messages, isLoading, sendMessage, loadSessionMessages, clearMessages } = useChat(currentSessionId);

  useEffect(() => {
    if (user?.user_id) {
      loadSessions();
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId);
    }
  }, [currentSessionId, loadSessionMessages]);

  useEffect(() => {
    const handleSessionsUpdated = (event: CustomEvent<Session[]>) => {
      setSessions(event.detail);
      if (event.detail.length > 0) {
        const newSessionId = event.detail[event.detail.length - 1].id;
        setCurrentSessionId(newSessionId);
      }
    };

    window.addEventListener('sessionsUpdated', handleSessionsUpdated as EventListener);
    return () => {
      window.removeEventListener('sessionsUpdated', handleSessionsUpdated as EventListener);
    };
  }, []);

  const loadSessions = async () => {
    try {
      if (user?.user_id) {
        const response = await sessionApi.getUserSessions();
        setSessions(response.sessions);
        if (response.sessions.length > 0 && currentSessionId === null) {
          setCurrentSessionId(response.sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleSessionSelect = (sessionId: number) => {
    if (sessionId === activeSessionId) {
      clearMessages();
      setActiveSessionId(null);
    } else {
      setCurrentSessionId(sessionId);
      setActiveSessionId(sessionId);
    }
  };

  const handleNewSession = () => {
    setCurrentSessionId(null);
    setActiveSessionId(null);
    clearMessages();
  };

  return (
    <div className="flex h-full">
      <SessionsSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
      />
      <div className="flex-1 flex flex-col">
        {activeSessionId !== null ? (
          <>
            <MessageList messages={messages} isLoading={isLoading} />
            <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a session to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
