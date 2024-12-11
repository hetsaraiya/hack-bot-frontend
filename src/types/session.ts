export interface Session {
  title: string;
  id: number;
  token: string;
}

export interface SessionsResponse {
  user_id: string;
  sessions: Session[];
}