// simple auth context (client-side only)
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      else localStorage.removeItem("auth_user");
    } catch (e) {}
  }, [user]);

  function login(payload) {
    // payload can be { mobile: "..." } or anything else
    // in real app you'd call API -> receive token + user data
    const u = { id: payload.mobile || "u1", name: payload.name || "You", mobile: payload.mobile };
    setUser(u);
    return u;
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
