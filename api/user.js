import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Assuming your user blueprint is registered under '/users' prefix in your Flask app.
// Adjust if your backend route is different.
export const userApiURL = "https://stock-smart-backend-ny1z.onrender.com/users";

// Get All Users request
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${userApiURL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error(
            "Get all users error:",
            error.response?.data || error.message
        );
        throw error;
    }
};
