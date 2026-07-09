import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { loginUser, registerUser, getMe } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ---------- Memoized functions ----------
  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    setUser(user);
    return res;
  }, []); // No dependencies – stable forever

  const register = useCallback(async (username, email, password) => {
    const res = await registerUser({ username, email, password });
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await getMe();
    setUser(res.data);
    return res;
  }, []);

  // ---------- Memoized value object ----------
  const value = useMemo(() => ({
    user,
    loading,
    isAuthed: !!user,
    login,
    register,
    logout,
    refreshUser,
  }), [user, loading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}