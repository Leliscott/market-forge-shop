
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  location?: string;
  accepted_terms: boolean;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  userStore: Store | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<boolean>;
  logout: () => void;
  createStore: (storeDetails: Omit<Store, 'id'>) => Promise<Store | null>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  session: Session | null;
}
