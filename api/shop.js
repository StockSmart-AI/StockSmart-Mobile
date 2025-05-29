import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refresh as authRefresh } from "./auth"; // Import the refresh function

// It's good practice to use a consistent base URL, possibly from a config file or environment variable.
// Assuming your shop blueprint is registered under '/shops' prefix in your Flask app.
export const shopApiURL = "https://stock-smart-backend-ny1z.onrender.com/shops";

// Create Shop request
export const createShop = async (name, address, accessToken) => {
    try {
        const response = await axios.post(
            `${shopApiURL}/shop`,
            {
                name,
                address,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired for createShop, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for createShop.");
                    // Propagate an error that AuthContext can catch to trigger logout
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);
                // The AuthContext should ideally update its in-memory token as well.
                // For now, we retry with the new token.

                console.log("Token refreshed for createShop, retrying original request...");
                const retryResponse = await axios.post(
                    `${shopApiURL}/shop`,
                    { name, address },
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                );
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for createShop:",
                    refreshError.response?.data || refreshError.message
                );
                // Clear tokens if refresh fails, as they might be invalid
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Create shop error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Get Shops by Owner request
export const getShopsByOwner = async (accessToken) => {
    try {
        const response = await axios.get(`${shopApiURL}/shops`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired for getShopsByOwner, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for getShopsByOwner.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for getShopsByOwner, retrying original request...");
                const retryResponse = await axios.get(`${shopApiURL}/shops`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for getShopsByOwner:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Get shops error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};
