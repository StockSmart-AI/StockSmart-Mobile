import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refresh as authRefresh } from "./auth"; // Assuming auth.js has a refresh function

// Assuming your product blueprint is registered under '/products' prefix in your Flask app.
export const productApiURL = "https://stock-smart-backend-ny1z.onrender.com/products";

// Helper function to handle token refresh and retry logic
const callApiWithTokenRefresh = async (apiCall, ...args) => {
    try {
        // Attempt the original API call
        const response = await apiCall(...args);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found.");
                    // Propagate an error that AuthContext can catch to trigger logout
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);
                // The AuthContext should ideally update its in-memory token as well.
                // For now, we retry the original request with the new token.

                console.log("Token refreshed, retrying original request...");
                // Retry the original API call with the new token (need to pass it along)
                // This requires the original apiCall function to accept token as an argument
                const retryResponse = await apiCall(newAccessToken, ...args.slice(1)); // Assuming token is the first arg
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed:",
                    refreshError.response?.data || refreshError.message
                );
                // Clear tokens if refresh fails, as they might be invalid
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


// --- API Functions ---

// Get all products
export const getAllProducts = async (token, shopId, page = 1, perPage = 10) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${productApiURL}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { shop_id: shopId, page, per_page: perPage },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get product by ID
export const getProductById = async (token, productId) => {
    const apiCall = async (accessToken) => {
        return axios.get(`${productApiURL}/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get all products by barcode (for a given shop)
export const getProductByBarcode = async (token, barcode, shopId) => {
     const apiCall = async (accessToken) => {
        return axios.get(`${productApiURL}/barcode/${barcode}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
             params: { shop_id: shopId }, // shop_id is a query parameter for this route
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
}


// Add a product (handles multipart/form-data)
// data should be a FormData object
export const addProduct = async (token, formData) => {
     const apiCall = async (accessToken) => {
        return axios.post(`${productApiURL}/add`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                 'Content-Type': 'multipart/form-data', // Ensure correct content type for FormData
            },
        });
    };
     // Note: For FormData with file uploads, token refresh retry might be complex.
     // The retry logic here re-sends the same FormData. If the file stream
     // is consumed on the first attempt, the retry might fail. Consider
     // rebuilding FormData or handling file uploads differently for robust retries.
    return callApiWithTokenRefresh(apiCall, token);
};

// Update product
export const updateProduct = async (token, productId, data) => {
     const apiCall = async (accessToken) => {
        return axios.put(`${productApiURL}/update/${productId}`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Delete product
export const deleteProduct = async (token, productId) => {
     const apiCall = async (accessToken) => {
        return axios.delete(`${productApiURL}/delete/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Restock products
export const restockProducts = async (token, restockData) => {
     const apiCall = async (accessToken) => {
        return axios.post(`${productApiURL}/restock`, restockData, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Sell products
export const sellProducts = async (token, sellData) => {
     const apiCall = async (accessToken) => {
        return axios.post(`${productApiURL}/sell`, sellData, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Delete item by barcode
export const deleteItemByBarcode = async (token, barcode) => {
     const apiCall = async (accessToken) => {
         // Note: Flask route uses barcode as a URL parameter, but the function signature uses it as an argument.
         // The route definition `'/delete/barcode', methods=['DELETE']` in Flask is slightly ambiguous
         // without seeing how the barcode is extracted. Assuming it's expected as a query param or in the body for DELETE.
         // The Flask function signature `def delete_item(barcode):` suggests it might be a URL param.
         // Let's assume URL parameter for now, consistent with other ID-based routes.
        return axios.delete(`${productApiURL}/delete/barcode/${barcode}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};

// Get all items of a product
export const getItemsByProductId = async (token, productId) => {
     const apiCall = async (accessToken) => {
        return axios.get(`${productApiURL}/get-items/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    };
    return callApiWithTokenRefresh(apiCall, token);
};
