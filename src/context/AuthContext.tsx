import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  getMemberData,
  logout as firebaseLogout,
  signInWithGoogle,
} from "../services/authService";
import type { User, Member } from "../types";

interface AuthContextType {
  user: User | null;
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
  refreshMember: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || undefined,
          phoneNumber: firebaseUser.phoneNumber || undefined,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Load member data
        const memberData = await getMemberData(firebaseUser.uid);
        setMember(memberData);
      } else {
        setUser(null);
        setMember(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (): Promise<User | null> => {
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    setMember(null);
    localStorage.removeItem("user");
  };

  const refreshMember = async () => {
    if (user) {
      const memberData = await getMemberData(user.id);
      setMember(memberData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshMember,
      }}
    >
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
