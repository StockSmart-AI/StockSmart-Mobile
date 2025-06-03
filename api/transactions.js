import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refresh as authRefresh } from "./auth";

// Base URL for transactions endpoints
export const transactionsApiURL = "https://stock-smart-backend-ny1z.onrender.com/transactions";

// Helper function to handle token refresh and retry logic
const callApiWithTokenRefresh = async (apiCall, ...args) => {
    try {
        const response = await apiCall(...args);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed, retrying original request...");
                const retryResponse = await apiCall(newAccessToken, ...args.slice(1));
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "API error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};

// Get transactions with optional filters
export const getTransactions = async (token, filters = {}) => {
    const apiCall = async (accessToken) => {
        const {
            shopId,
            transactionType,
            page = 1,
            perPage = 10
        } = filters;

        // Build query parameters
        const params = new URLSearchParams();
        if (shopId) params.append('shop_id', shopId);
        if (transactionType) params.append('type', transactionType);
        params.append('page', page);
        params.append('per_page', perPage);

        return axios.get(`${transactionsApiURL}?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get transaction by ID
export const getTransactionById = async (token, transactionId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${transactionsApiURL}/${transactionId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Helper function to format date for API
export const formatDateForAPI = (date) => {
    return date.toISOString();
};

// Helper function to parse API response
export const parseTransactionResponse = (response) => {
    const { transactions, total, page, per_page, total_pages } = response.data;
    return {
        transactions,
        pagination: {
            total,
            currentPage: page,
            perPage: per_page,
            totalPages: total_pages
        }
    };
}; 