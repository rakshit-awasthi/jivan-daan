import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, useGetUser } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (uid: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(localStorage.getItem("jivan_daan_uid"));
  
  const { data: user, isLoading, isError } = useGetUser(uid || "", {
    query: { enabled: !!uid, retry: 1 }
  });

  useEffect(() => {
    if (isError) {
      // Mock UID not found or API error
      localStorage.removeItem("jivan_daan_uid");
      setUid(null);
    }
  }, [isError]);

  const login = (newUid: string) => {
    localStorage.setItem("jivan_daan_uid", newUid);
    setUid(newUid);
  };

  const logout = () => {
    localStorage.removeItem("jivan_daan_uid");
    setUid(null);
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading: !!uid && isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
