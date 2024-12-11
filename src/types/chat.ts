export interface Message {
  question: string;
  answer: string;
  timestamp?: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  user_id: number;
  id: number;
}

export interface SessionQAResponse {
  session_id: number;
  qa_pairs: Message[];
}