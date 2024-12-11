export interface User {
  user_name: string;
  user_id: number;
  user_email: string;
}

export interface AuthResponse {
  user_name: string;
  user_id: number;
  user_email: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}