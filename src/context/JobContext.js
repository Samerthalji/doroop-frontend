import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAllJobs, searchJobsBySkill } from "../Api/jobService";

const JobContext = createContext();

// دالة مساعدة لاستخراج مصفوفة الوظائف من أي شكل response
const extractJobsArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.jobs)) return data.jobs;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.results)) return data.results;

    return [];
};

// تحويل بيانات الـ API لشكل موحد
const mapJob = (job) => ({
    id: job.id,
    title: job.title,
    company: job.companyName || 'Unknown Company',
    logo: job.logoUrl||'/googleLogo.png',
    date: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '',
    salary: job.salary,
    type: job.typeJob || '',
    experience: job.experienceLevel || '',
    location: job.location || '',
    jobType: job.typeJob || '',
    description: job.description || '',
    skills: job.skills || [],
    applicationsCount: job.applicationsCount || 0,
    companyId: job.companyId,
    responsibilities: [],
});

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // تحميل الوظائف المحفوظة كاملة من localStorage
    const [savedJobs, setSavedJobs] = useState(() => {
        try {
            const stored = localStorage.getItem('savedJobs');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // حفظ الوظائف المحفوظة بـ localStorage كل ما تتغير
    useEffect(() => {
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    }, [savedJobs]);

    // toggle save/unsave — بيحفظ كامل بيانات الوظيفة
    const toggleSaveJob = useCallback((job) => {
        setSavedJobs(prev => {
            const exists = prev.some(j => j.id === job.id);
            return exists ? prev.filter(j => j.id !== job.id) : [...prev, job];
        });
    }, []);

    const isJobSaved = useCallback((jobId) => {
        return savedJobs.some(j => j.id === jobId);
    }, [savedJobs]);

    // IDs فقط للاستخدام بالـ JobCard
    const savedJobIds = savedJobs.map(j => j.id);

    // جلب كل الوظائف
    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllJobs();
            const jobsArray = extractJobsArray(response.data);
            setJobs(jobsArray.map(mapJob));
        } catch (err) {
            console.error("فشل في جلب الوظائف:", err);
            setError(err?.message || "Error fetching jobs");
        } finally {
            setLoading(false);
        }
    }, []);

    // البحث عن وظائف بالمهارة
    const fetchJobsBySkill = useCallback(async (skill, page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await searchJobsBySkill(skill, page, pageSize);

            const jobsArray = extractJobsArray(response.data);
            setJobs(jobsArray.map(mapJob));
            return response;
        } catch (err) {
            console.error("فشل في البحث عن الوظائف:", err);
            setError(err?.message || "Error searching jobs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return (
        <JobContext.Provider value={{
            jobs, setJobs,
            loading, error,
            fetchJobs, fetchJobsBySkill,
            savedJobs, savedJobIds,
            toggleSaveJob, isJobSaved
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => useContext(JobContext);
