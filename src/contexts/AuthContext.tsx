// AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  type User,
  type LoginCredentials,
  type RegisterData,
} from "../lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Suprime el error de ESLint para este hook específico
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await authLogin(credentials);

      if (result.error) {
        return { error: result.error };
      }

      if (result.user) {
        setUser(result.user);
      }

      return {};
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred during login" };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await authRegister(data);

      if (result.error) {
        return { error: result.error };
      }

      if (result.user) {
        setUser(result.user);
      }

      return {};
    } catch (error) {
      console.error("Register error:", error);
      return { error: "An unexpected error occurred during registration" };
    }
  };

  const logout = () => {
    try {
      authLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
