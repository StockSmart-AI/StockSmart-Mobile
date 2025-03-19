import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "@/utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const userSession = await AsyncStorage.getItem("user");
        if (userSession) {
          const user = JSON.parse(userSession);
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading user session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const signup = async (name, email, password, phone) => {
    try {
      // const response = await api.signup(name, email, password, phone);
      const user = { email, password };
      setUser(user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Sign up failed: ", error);
    }
  };

  const login = async (email, password) => {
    try {
      // const response = await api.login(email, password);
      const user = { email, password };
      setUser(user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Log in failed: ", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
