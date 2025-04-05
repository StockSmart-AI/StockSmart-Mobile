import React, { createContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as authApi from "@/api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  //load tokens for store
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );

        if (storedToken && storedRefreshToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
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
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          authApi.refresh(refreshToken).catch(() => {
            try {
              setUser(null);
              setToken(null);
              AsyncStorage.removeItem("user");
              SecureStore.deleteItemAsync("authToken");
              SecureStore.deleteItemAsync("refreshToken");
            } catch (error) {
              console.error("Logout Failed: ", error);
            }
          });
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  const signup = async (name, email, password, role) => {
    const response = await authApi.signup(name, email, password, role);
    if (response.status === 201) {
      try {
        await authApi.sendOtp(email);
      } catch (error) {
        console.error("Error sending OTP: ", error);
      }
    } else {
      console.error("Sign up failed: ", error);
    }
  };

  const sendOtp = async (email) => {
    const response = await authApi.sendOtp(email);
    if (response.status === 200) {
    } else {
      console.error("Error sending OTP: ", error);
    }
  };

  const verify = async (otp, email) => {
    const response = await authApi.verify(otp, email);
    if (response.status === 200) {
      const token = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const id = response.data.user_id;
      setIsVerified(true);
      const user = { id, email };
      setUser(user);
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      console.error("Verification failed: ", error);
    }
  };

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    if (response.status === 200) {
      const token = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const id = response.data.user_id;
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      setToken(token);
      setRefreshToken(refreshToken);
      const user = { id, email };
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      throw new Error(response.data.message);
    }
  };

  const refresh = async () => {
    const response = await authApi.refresh(refreshToken);
    if (response.status === 200) {
      const token = response.data.access_token;
      await SecureStore.setItemAsync("authToken", token);
      setToken(token);
    } else {
      throw new Error(response.data.message);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      AsyncStorage.removeItem("user");
      SecureStore.deleteItemAsync("authToken");
      SecureStore.deleteItemAsync("refreshToken");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        isVerified,
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
