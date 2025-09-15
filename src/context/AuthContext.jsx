import { createContext, useContext, useState, useEffect, useRef } from "react";
import { setAuthToken, api } from "../lib/api";
import { getTodos } from "../services/todos";

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

  useEffect(() => {
    if (hasInitialized.current) return;

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

      fetchTodos().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    hasInitialized.current = true;
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await api.post("/user/login", credentials);
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);

      const safeUser = userData || { email: credentials.email };
      localStorage.setItem("user", JSON.stringify(safeUser));

      setAuthToken(token);
      setUser(safeUser);

      await fetchTodos();

      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
    setTodos([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, todos, setTodos, fetchTodos, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
