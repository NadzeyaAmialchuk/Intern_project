export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    password_salt: string;
    phone?: string;
    is_verified: boolean;
    created_at: Date;
  }
  