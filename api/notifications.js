import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refresh as authRefresh } from "./auth";

export const notificationsApiURL = "https://stock-smart-backend-ny1z.onrender.com";

// Get all notifications for the current user
export const getNotifications = async (accessToken) => {
    try {
        console.log('Attempting to get notifications');
        
        const response = await axios.get(`${notificationsApiURL}/notifications`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Get notifications response:', response.data);
        return response;
    } catch (error) {
        console.error('Get notifications error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        if (error.response && error.response.status === 401) {
            console.log("Access token expired for getNotifications, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for getNotifications.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for getNotifications, retrying original request...");
                const retryResponse = await axios.get(notificationsApiURL, {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });
                console.log('Retry get notifications response:', retryResponse.data);
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for getNotifications:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Get notifications error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Request access to a shop
export const requestShopAccess = async (shopId, accessToken) => {
    try {
        console.log('Attempting to request access for shop:', shopId);
        
        const response = await axios.post(
            `${notificationsApiURL}/shop/${shopId}/request-access`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log('Request shop access response:', response.data);
        return response;
    } catch (error) {
        console.error('Request shop access error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        if (error.response && error.response.status === 401) {
            console.log("Access token expired for requestShopAccess, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for requestShopAccess.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for requestShopAccess, retrying original request...");
                const retryResponse = await axios.post(
                    `${notificationsApiURL}/shop/${shopId}/request-access`,
                    {},
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                );
                console.log('Retry request shop access response:', retryResponse.data);
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for requestShopAccess:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Request shop access error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Respond to an access request
export const respondToAccessRequest = async (notificationId, action, accessToken) => {
    try {
        console.log('Attempting to respond to access request:', { notificationId, action });
        
        const response = await axios.post(
            `${notificationsApiURL}/notifications/${notificationId}/respond`,
            { action },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log('Respond to access request response:', response.data);
        return response;
    } catch (error) {
        console.error('Respond to access request error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        if (error.response && error.response.status === 401) {
            console.log("Access token expired for respondToAccessRequest, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for respondToAccessRequest.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for respondToAccessRequest, retrying original request...");
                const retryResponse = await axios.post(
                    `${notificationsApiURL}/${notificationId}/respond`,
                    { action },
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                );
                console.log('Retry respond to access request response:', retryResponse.data);
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for respondToAccessRequest:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Respond to access request error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
}; 