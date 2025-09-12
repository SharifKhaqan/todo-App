import { createContext, useContext, useState, useEffect, useRef } from "react";
import { setAuthToken, api } from "../lib/api";
import { getTodos } from "../services/todos";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout();
      }
    }
  };
  
  // Logout 
  const logout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
    setTodos([]);
  };

  useEffect(() => {
    if (hasInitialized.current) return;

    const initAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token) {
          setAuthToken(token);
          if (savedUser && savedUser !== "undefined") {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(null);
              localStorage.removeItem("user");
            }
          }
          await fetchTodos();
          setLoading(false);
          hasInitialized.current = true;
          return;
        }

        // Try to refresh access token from cookie if no token found
        const refreshCookie = Cookies.get("refreshToken");
        if (refreshCookie) {
          try {
            const res = await api.post("/user/refresh", {}, { withCredentials: true });
            const newToken = res.data?.accessToken;
            const returnedUser = res.data?.user;

            if (newToken) {
              localStorage.setItem("token", newToken);
              setAuthToken(newToken);

              if (returnedUser) {
                setUser(returnedUser);
                localStorage.setItem("user", JSON.stringify(returnedUser));
              } else if (savedUser && savedUser !== "undefined") {
                try {
                  setUser(JSON.parse(savedUser));
                } catch {
                  setUser(null);
                  localStorage.removeItem("user");
                }
              }

              await fetchTodos();
            } else {
              logout();
            }
          } catch (err) {
            logout();
          } finally {
            setLoading(false);
            hasInitialized.current = true;
            return;
          }
        }

        setLoading(false);
        hasInitialized.current = true;
      } catch (err) {
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await api.post("/user/login", credentials);
      const { token, refreshToken, user: userData } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        setAuthToken(token);
      }

      if (refreshToken) {
        const isSecure = window.location.protocol === "https:";
        Cookies.set("refreshToken", refreshToken, {
          secure: isSecure,
          sameSite: "strict",
          path: "/",
          expires: 7,
        });
      }

      const safeUser = userData || { email: credentials.email };
      localStorage.setItem("user", JSON.stringify(safeUser));
      setUser(safeUser);

      await fetchTodos();
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, todos, setTodos, fetchTodos, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
