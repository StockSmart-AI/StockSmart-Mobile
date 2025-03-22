import axios from "axios";

const apiURL = "https://stock-smart-backend.onrender.com";

//Sign Up request
export const signup = async (name, email, password, phone) => {
  try {
    const response = await axios.post(`${apiURL}/auth/signup`, {
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

//Login Request
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiURL}/auth/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
