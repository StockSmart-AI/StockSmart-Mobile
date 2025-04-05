import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiURL = "https://stock-smart-backend.onrender.com/auth";


// Sign Up request
export const signup = async (name, email, password, phone) => {
  try {
    const response = await axios.post(`${apiURL}/signup`, {
      name,
      email,
      password,
      phone,
    });
    return response;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

// Login Request
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiURL}/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Refresh Request
export const refresh = async (refresh_token) => {
  try {
    const response = await axios.post(`${apiURL}/refresh`, {
      refresh_token,
    });

    const { accessToken, refreshToken } = response.data;

    await SecureStore.setItemAsync("authToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    return response;
  } catch (error) {
    console.error("Refresh token error:", error.response?.data || error.message);
    throw error;
  }
};


// send otp
export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${apiURL}/send-otp`, {
      email,
    });
    return response;
  } catch (error) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error;
  }
}

export const verify = async (otp, email) => {
  try {
    const response = await axios.post(`${apiURL}/verify-otp`, {
      email,
      otp,
    });
    return response;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
}