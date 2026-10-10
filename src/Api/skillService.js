import axios from "./apiClient";

const API_URL = "/skill";
export const deleteSkill = async (skillId) => {
    try {

        const response = await axios.delete(`${API_URL}/${skillId}`);
        return response.data;
    }
    catch (error) {
        throw error.response ? error.response.data : new Error("Failed to delete skill");
    }
}
export const addSkill = async (skillData) => {
    try {

        const response = await axios.post(API_URL, skillData);
        return response.data;
    }
    catch (error) {
        throw error.response ? error.response.data : new Error("Failed to add skill");
    }
}

