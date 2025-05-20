
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userStore: Store | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<boolean>;
  logout: () => void;
  createStore: (storeDetails: Omit<Store, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check for stored auth on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('marketplace_user');
    const storedStore = localStorage.getItem('marketplace_store');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      if (storedStore) {
        setUserStore(JSON.parse(storedStore));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock implementation - in a real app, this would call an API
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock users for demo purposes
      const mockUsers = [
        { id: '1', name: 'John Seller', email: 'seller@example.com', password: 'password', role: 'seller' as const },
        { id: '2', name: 'Jane Buyer', email: 'buyer@example.com', password: 'password', role: 'buyer' as const }
      ];
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('marketplace_user', JSON.stringify(userWithoutPassword));
        
        // If user is a seller, also set mock store data
        if (foundUser.role === 'seller') {
          const mockStore = {
            id: '1',
            name: 'John\'s Amazing Store',
            description: 'The best products for everyone',
            logo: '/placeholder.svg'
          };
          setUserStore(mockStore);
          localStorage.setItem('marketplace_store', JSON.stringify(mockStore));
        }
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'buyer' | 'seller'
  ): Promise<boolean> => {
    // This is a mock implementation - in a real app, this would call an API
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('marketplace_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to our marketplace, ${name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserStore(null);
    setIsAuthenticated(false);
    localStorage.removeItem('marketplace_user');
    localStorage.removeItem('marketplace_store');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const createStore = (storeDetails: Omit<Store, 'id'>) => {
    const newStore = {
      ...storeDetails,
      id: Math.random().toString(36).substr(2, 9)
    };
    setUserStore(newStore);
    localStorage.setItem('marketplace_store', JSON.stringify(newStore));
    toast({
      title: "Store created",
      description: `"${storeDetails.name}" has been successfully created!`,
    });
  };

  const value = {
    user,
    isAuthenticated,
    userStore,
    login,
    register,
    logout,
    createStore
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
