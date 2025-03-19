import axios from "axios";

const apiURL = "http://172.25.114.60:5000/api";

//Sign Up request
export const signup = async (name, email, password, phone) => {
  try {
    const response = await axios.post(`${apiURL}/signup`, {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

//Login Request
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiURL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
