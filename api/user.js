import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Assuming your user blueprint is registered under '/users' prefix in your Flask app.
// Adjust if your backend route is different.
export const userApiURL = "https://stock-smart-backend-ny1z.onrender.com/user";

// Get All Users request
export const getUserByEmail = async (token, email) => {
    try {
        const response = await axios.get(`${userApiURL}/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error(
            "Get user by email error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// New function to send invitation and permissions
export const sendInvitationAndPermissions = async (accessToken, shopId, employeeEmail, canRestock) => {
    try {
        const response = await axios.post(
            `${userApiURL}/invite`,
            {
                shop_id: shopId,
                email: employeeEmail,
                can_restock: canRestock,
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
            console.log("Access token expired for sending invitation, attempting refresh...");
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    console.error("No refresh token found for sending invitation.");
                    throw new Error("Session expired. Please login again.");
                }

                const refreshResponse = await authRefresh(refreshToken);
                const newAccessToken = refreshResponse.data.access_token;

                await SecureStore.setItemAsync("accessToken", newAccessToken);

                console.log("Token refreshed for sending invitation, retrying original request...");
                const retryResponse = await axios.post(
                    `${userApiURL}/invite`,
                    {
                        shop_id: shopId,
                        email: employeeEmail,
                        can_restock: canRestock,
                    },
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                );
                return retryResponse;
            } catch (refreshError) {
                console.error(
                    "Token refresh failed for sending invitation:",
                    refreshError.response?.data || refreshError.message
                );
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                throw new Error("Session expired. Please login again.");
            }
        } else {
            console.error(
                "Send invitation error:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
};
