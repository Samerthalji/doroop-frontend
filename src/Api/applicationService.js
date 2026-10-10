import Api from './apiClient';


export const getJobApplications = async ({ jobId, companyId, pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await Api.post('/application/job/applications', {
            jobId,
            companyId,
            pageNumber,
            pageSize
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching job applications");
    }
};


export const applyToJob = async (jobId, cvFile) => {
    try {
        const formData = new FormData();
        formData.append('cvFile', cvFile);

        const response = await Api.post(`/application/apply?jobId=${jobId}`, formData, {
            headers: {
           
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error applying to job");
    }
};


export const getMyApplications = async (pageNumber = 1, pageSize = 20) => {
    try {
        const response = await Api.post('/application/MyApplication', {}, {
            params: { pageNumber, pageSize }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching user applications");
    }
};

export const deleteApplication = async (applicationId) => {
    try {
        const response = await Api.delete(`/application/${applicationId}`
        );
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error deleting application");
    }
};


export const getApplicationDetails = async (applicationId) => {
    try {
        const response = await Api.get('/application/Details', {
            params: { applicationId },
        
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching application details");
    }
};


export const updateApplicationStatus = async (userId, applicationId, status) => {
    try {
        const response = await Api.post('/application/Status', null, {
            params: { userId, applicationId, status }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error updating application status");
    }
};