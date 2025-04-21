import React, { createContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as authApi from "@/api/auth";
import axios from "axios";
import { router } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //load tokens from store
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );
        let storedUser = await AsyncStorage.getItem("user");
        storedUser = storedUser ? JSON.parse(storedUser) : null;
        if (storedToken && storedRefreshToken && storedUser) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // reactive handler for token expiration
  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      if (nextState === "active") {
        if (loading) return;
        if (token) {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            refresh().catch(() => {
              logout();
            });
          }
        } else {
          logout();
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [refreshToken, token, loading]);

  //signup handler
  const signup = async (name, email, password, role) => {
    const response = await authApi.signup(name, email, password, role);
    if (response.status === 201) {
      try {
        const newUser = response.data.user;
        setUser(newUser);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        await authApi.sendOtp(email);
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.error("Sign up failed");
    }
  };

  //OTP sending handler
  const sendOtp = async (email) => {
    const response = await authApi.sendOtp(email);
    if (response.status === 200) {
    } else {
      console.error("Error sending OTP");
    }
  };

  //OTP verification handler
  const verify = async (otp, email) => {
    const response = await authApi.verify(otp, email);
    if (response.status === 200) {
      const newToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const newUser = response.data.user;
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
      await SecureStore.setItemAsync("authToken", newToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } else {
      console.error("Verification failed");
    }
  };

  //login handler
  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    if (response.status === 200) {
      const token = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const newUser = response.data.user;
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    } else {
      throw new Error(response.data.message);
    }
  };

  //Token refresh handler
  const refresh = async () => {
    const response = await authApi.refresh(refreshToken);
    if (response.status === 200) {
      const newToken = response.data.access_token;
      await SecureStore.setItemAsync("authToken", newToken);
      setToken(newToken);
      return response;
    } else {
      throw new Error(response.data.message);
    }
  };

  //logout handler
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("user");
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
  };

  //axios instance with iterceptor for protected requests
  const protectedAPI = axios.create({
    baseURL: "https://stock-smart-backend-ny1z.onrender.com/",
  });

  protectedAPI.interceptors.request.use(
    async (req) => {
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }

      return req;
    },
    (error) => Promise.reject(error)
  );

  protectedAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
      const req = error.config;

      if (error.response?.status === 401 && !req._retry) {
        req._retry = true;

        try {
          const response = await refresh();
          req.headers.Authorization = `Bearer ${response.data.access_token}`;
          return protectedAPI(req);
        } catch (error) {
          logout();
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        refreshToken,
        protectedAPI,
        signup,
        sendOtp,
        verify,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
