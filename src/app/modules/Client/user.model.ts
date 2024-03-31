export interface User {
  id?: number;
  profile_id?: string | undefined;
  name: string;
  number: string;
  email: string;
  image: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}
