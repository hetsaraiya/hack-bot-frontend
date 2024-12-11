import { MessageSquare, Plus } from 'lucide-react';
import type { Session } from '../../types/session';

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
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
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
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSessionSelect(session.id)}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              currentSessionId === session.id
                ? 'bg-blue-100 text-blue-800'
                : 'hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="truncate">{session.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}