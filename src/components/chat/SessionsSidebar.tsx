import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import type { Session } from '../../types/session';
import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';
import { sessionApi } from '../../services/api';

interface SessionsSidebarProps {
  sessions: Session[];
  currentSessionId: number | null;
  onSessionSelect: (sessionId: number) => void;
  onNewSession: () => void;
}

export function SessionsSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
}: SessionsSidebarProps) {
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    setLocalSessions(sessions);
  }, [sessions]);

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await sessionApi.deleteSession(sessionId, token);
      setLocalSessions((prevSessions) => prevSessions.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        onNewSession();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col sessions-sidebar">
      <div className="p-4 border-b">
        <button
          onClick={onNewSession}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            currentSessionId === null
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {localSessions.map((session) => (
          <div
            key={session.id}
            className={`relative w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100 ${
              currentSessionId === session.id ? 'selected-session' : ''
            }`}
          >
            <button
              onClick={() => onSessionSelect(session.id)}
              className="w-full flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{session.title}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSession(session.id);
              }}
              className="text-red-600 hover:text-red-800 absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity delete-button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
