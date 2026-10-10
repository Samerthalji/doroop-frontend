 import Api from './apiClient';

// ===================== إنشاء وظيفة جديدة =====================
// POST /api/v1/job?userId=...
// Body: { title, description, salary, location, typeJob, experienceLevel, companyId, skills }
export const createJob = async (jobData) => {
    try {

        const response = await Api.post(`/job`, jobData);
        return response;
    } catch (error) {
        // طباعة تفاصيل الخطأ القادمة من السيرفر (Response) وليس فقط الخطأ العام
        console.error("Server Error Response:", error.response?.data);
        throw error.response ? error.response.data : new Error("Error");
    }
};

// ===================== جلب جميع الوظائف =====================
// GET /api/v1/job
export const getAllJobs = async () => {
    try {
        const response = await Api.get('/job');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching jobs");
    }
};

// ===================== جلب وظيفة بالـ ID =====================
// GET /api/v1/job?id=...
export const getJobById = async (jobId) => {
    try {
        const response = await Api.get(`/job?id=${jobId}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching job");
    }
};

// ===================== البحث عن وظائف بالمهارة =====================
// GET /api/v1/job/search-by-skill?page=...&pageSize=...&skill=...
export const searchJobsBySkill = async (skill, page = 1, pageSize = 10) => {
    try {

        const response = await Api.get('/job/search-by-skill', {
            params: { skill, page, pageSize }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error searching jobs by skill");
    }
};

// ===================== حذف وظيفة =====================
// DELETE /api/v1/job/{id}?adminId=...
export const deleteJob = async (jobId) => {
    try {
        const response = await Api.delete(`/job/${jobId}`
        );
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error deleting job");
    }
};

// ===================== تعديل وظيفة =====================
// PUT /api/v1/job/{jobId}?adminId=...
// Body: { title, description, salary, location, typeJob, experienceLevel, skills }
export const updateJob = async (jobId, jobData) => {
    try {
        const response = await Api.put(`/job/${jobId}`, jobData,
        );
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error updating job");
    }
};
export const getJobsByCompany = async (companyId, page = 1, pageSize = 10) => {
    try {
        const response = await Api.get('/job/company', {
            params: { companyId, page, pageSize }
        });
        return response.data; // نفترض أن البيانات تعود في response.data
    } catch (error) {
        console.error("Fetch Company Jobs Error:", error.response?.data);
        throw error.response ? error.response.data : new Error("Error fetching jobs");
    }
};
