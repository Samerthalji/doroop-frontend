import Api from "./apiClient";

const API_URL = "/users";
export const getUserProfile = async () => {
    try {


           const response = await Api.get(`${API_URL}/profile`)

            return response.data;
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
         throw error.response?error.response.data :new Error("error ");}
    }
export const updateUserProfile = async (formData) => {
    try {

        const response = await Api.post(`${API_URL}/upload-image`, formData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error.response ? error.response.data : new Error("Error updating user profile");
    }
};

export const updateUserInfo = async (userData) => {
    try {
        const response = await Api.put(`${API_URL}/user`, userData,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error.response ? error.response.data : new Error("Error updating user info");
    }
};
