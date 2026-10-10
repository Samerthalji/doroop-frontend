import api from "./apiClient";

export const createCompany = async (companyData) => {
    try {
         const response = await api.post('/company', companyData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to create company");
    }   
}
export const uploadImageCompany = async (companyId, imageFile) => {
    try {
        const formData = new FormData();
        
        // التعديل هنا: غيرنا 'image' إلى 'file'
        formData.append('file', imageFile); 
        
        const response = await api.post(`/company/${companyId}/logo`, formData, {
            headers: {
                 'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to upload company image");
    }
}
export const getCompanyById = async (companyId) => {
    try {
        const response = await api.get(`/company/${companyId}` 
         );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to fetch company info");
    }
}