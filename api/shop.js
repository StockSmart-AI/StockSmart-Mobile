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
export const getShopsByUser = async (accessToken) => {
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

// Update Shop request
export const updateShop = async (shopId, name, address, accessToken) => {
    try {
        console.log('Attempting to update shop with:', {
            url: `${shopApiURL}/shop/${shopId}`,
            shopId,
            name,
            address
        });
        
        const response = await axios.put(
            `${shopApiURL}/shop/${shopId}`,
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
        console.log('Update shop response:', response.data);
        return response;
    } catch (error) {
        console.error('Update shop error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        if (error.response && error.response.status === 401) {
            console.log("Access token expired for updateShop, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for updateShop.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for updateShop, retrying original request...");
                const retryResponse = await axios.put(
                    `${shopApiURL}/shop/${shopId}`,
                    { name, address },
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                );
                console.log('Retry update shop response:', retryResponse.data);
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for updateShop:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Update shop error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Delete Shop request
export const deleteShop = async (shopId, accessToken) => {
    try {
        const response = await axios.delete(`${shopApiURL}/shop/${shopId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired for deleteShop, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for deleteShop.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for deleteShop, retrying original request...");
                const retryResponse = await axios.delete(`${shopApiURL}/shop/${shopId}`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for deleteShop:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Delete shop error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Get Shop by ID request
export const getShopById = async (shopId, accessToken) => {
    try {
        console.log('Attempting to get shop with ID:', shopId);
        
        const response = await axios.get(`${shopApiURL}/shop/${shopId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Get shop response:', response.data);
        return response;
    } catch (error) {
        console.error('Get shop error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        if (error.response && error.response.status === 401) {
            console.log("Access token expired for getShopById, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for getShopById.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for getShopById, retrying original request...");
                const retryResponse = await axios.get(`${shopApiURL}/shop/${shopId}`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });
                console.log('Retry get shop response:', retryResponse.data);
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for getShopById:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Get shop error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};
