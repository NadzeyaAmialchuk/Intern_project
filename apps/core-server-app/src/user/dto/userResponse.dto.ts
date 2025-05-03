export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar_id?: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}
