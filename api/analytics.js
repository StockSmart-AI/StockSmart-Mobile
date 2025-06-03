import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refresh as authRefresh } from "./auth";

// Base URL for analytics endpoints
export const analyticsApiURL = "https://stock-smart-backend-ny1z.onrender.com/analytics";

// Helper function to handle token refresh and retry logic (same as in stock.js)
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

// Get summary cards data
export const getSummaryCards = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/summary_cards/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get pie chart data for stock by category
export const getPieChartData = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/pie_chart/stock_by_category/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get line chart data for monthly sales
export const getLineChartData = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/line_chart/monthly_sales/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get bar chart data for daily sales
export const getBarChartData = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/bar_chart/daily_sales/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get critical products data
export const getCriticalProducts = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/critical_products/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get top selling products data
export const getTopSellingProducts = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/top_selling_products/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get top stocked products data
export const getTopStockedProducts = async (token, shopId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${analyticsApiURL}/top_stocked_products/${shopId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
}; 