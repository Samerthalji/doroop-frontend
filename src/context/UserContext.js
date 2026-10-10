import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../Api/userService";
import { clearSession } from "../utils/session";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 3. يفضل تبدأ بـ true لتجنب الـ Flicker

  const fetchUser = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const data = await getUserProfile();

      setUser(data);
    } catch (error) {
      console.error("fetchUser error:", error);
      logout();
    }
  }
  setLoading(false);
};
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUser();
  };

  const logout = () => {
    // Clears access token, refresh token AND the per-user saved jobs.
    clearSession();
    setUser(null);
    window.location.replace('/login'); // hard redirect also resets in-memory state
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);