export interface User {
    id: string;
    email: string;
    password?: string;
    password_salt?: string;
    phone?: string;
  }