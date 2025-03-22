import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as api from "@/utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const signup = async (name, email, password, phone) => {
    const response = await api.signup(name, email, password, phone);
    if (response.status === 201) {
      const token = response.data.access_token;
      await SecureStore.setItemAsync("authToken", token);
      setToken(token);
      const user = { email, password };
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      console.error("Sign up failed: ", error);
    }
  };

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response.status === 200) {
      const token = response.data.access_token;
      await SecureStore.setItemAsync("authToken", token);
      setToken(token);
      const user = { email, password };
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      console.error("Log in failed: ", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      AsyncStorage.removeItem("user");
      SecureStore.deleteItemAsync("authToken");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signup, login, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
