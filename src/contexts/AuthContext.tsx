import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Initialize auth state from local storage instantly
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser); // hydrate instantly

          // Verify token validity in background
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 🔹 Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // ✅ redirect to homepage or dashboard
      navigate("/");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Register handler
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // ✅ redirect to home right after register
      navigate("/");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Playfair Display", serif',
            color: "#3b2b19",
            fontSize: "1.2rem",
          }}
        >
          Preparing your inkstand...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};