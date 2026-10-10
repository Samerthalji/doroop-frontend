import { toast } from '../utils/toast';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getJobsByCompany, updateJob, deleteJob } from '../Api/jobService';
import { getCompanyById } from '../Api/companyService';
import CompanySidebar from '../components/CompanySidebar';

export default function MyJobs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (!id) return;

      const [companyRes, jobsData] = await Promise.all([
        getCompanyById(id),
        getJobsByCompany(id, 1, 100)
      ]);

      setCompany(companyRes);
      const finalJobs = jobsData?.data || jobsData?.items || (Array.isArray(jobsData) ? jobsData : []);
      setJobs(finalJobs);

    } catch (err) {
      console.error("Error fetching data:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [fetchData]);

  const handleDelete = async (jobId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) {
      try {
        await deleteJob(jobId);
        setJobs(prev => prev.filter(j => j.id !== jobId));
        toast.success("تم الحذف بنجاح");
      } catch (err) {
        toast.error("حدث خطأ أثناء الحذف.");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // تجهيز الـ Payload وتحويل السكلز لـ Array
      const payload = {
        title: selectedJob.title,
        description: selectedJob.description,
        salary: Number(selectedJob.salary),
        location: selectedJob.location,
        typeJob: selectedJob.typeJob || selectedJob.typeJop,
        experienceLevel: selectedJob.experienceLevel || selectedJob.experieceLevel,
        // تحويل النص الراجع من الـ Input إلى Array نظيف
        skills: typeof selectedJob.skills === 'string'
                ? selectedJob.skills.split(',').map(s => s.trim()).filter(s => s !== "")
                : selectedJob.skills
      };

      await updateJob(selectedJob.id, payload);

      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...payload } : j));
      setIsEditModalOpen(false);
      toast.success("تم تحديث الوظيفة والمهارات بنجاح!");
    } catch (err) {
      toast.error("فشل التحديث.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <CompanySidebar companyId={id} companyLogo={company?.logoUrl} companyName={company?.name} />

      <main className="flex-1 p-8 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase mb-2">
                My <span className="text-indigo-600">Postings</span>
              </h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">
                {company?.name || "Company"} Jobs Management
              </p>
            </div>
            <button onClick={() => navigate(-1)} className="bg-white border border-slate-200 text-slate-500 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
              ← Back
            </button>
          </header>

          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <motion.div layout key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black italic text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {job.title?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic">{job.title}</h3>
                      <div className="flex gap-3 mt-2">
                        <span className="bg-slate-50 px-3 py-1 rounded-full text-[8px] font-black text-slate-400 uppercase">{job.typeJob || job.typeJop}</span>
                        <span className="text-indigo-500 text-[8px] font-black uppercase tracking-widest">{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedJob(job); setIsEditModalOpen(true); }} className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-black text-[9px] uppercase">Edit</button>
                    <button onClick={() => handleDelete(job.id)} className="px-5 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[9px] uppercase">Delete</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs italic">No active listings found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isEditModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black uppercase italic mb-8">Update <span className="text-indigo-600">Job Posting</span></h2>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Job Title</label>
                    <input required className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500" value={selectedJob.title} onChange={e => setSelectedJob({...selectedJob, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Location</label>
                    <input required className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500" value={selectedJob.location} onChange={e => setSelectedJob({...selectedJob, location: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Description</label>
                  <textarea required rows="3" className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500" value={selectedJob.description} onChange={e => setSelectedJob({...selectedJob, description: e.target.value})} />
                </div>

                {/* حقل السكلز (Skills) - التعديل الجديد هنا */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Required Skills (Comma separated)</label>
                  <input
                    required
                    placeholder="e.g. React, C#, SQL"
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500"
                    // إذا كانت سكلز مصفوفة بنحولها لنص، وإذا كانت نص بنخليها نص
                    value={Array.isArray(selectedJob.skills) ? selectedJob.skills.join(', ') : selectedJob.skills}
                    onChange={e => setSelectedJob({...selectedJob, skills: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Salary</label>
                    <input type="number" className="w-full p-4 bg-slate-50 rounded-xl font-bold" value={selectedJob.salary} onChange={e => setSelectedJob({...selectedJob, salary: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Type</label>
                    <select className="w-full p-4 bg-slate-50 rounded-xl font-black text-[9px] uppercase" value={selectedJob.typeJob || selectedJob.typeJop} onChange={e => setSelectedJob({...selectedJob, typeJob: e.target.value})}>
                        <option value="FullTime">FullTime</option>
                        <option value="PartTime">PartTime</option>
                        <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Level</label>
                    <select className="w-full p-4 bg-slate-50 rounded-xl font-black text-[9px] uppercase" value={selectedJob.experienceLevel || selectedJob.experieceLevel} onChange={e => setSelectedJob({...selectedJob, experienceLevel: e.target.value})}>
                        <option value="Senior">Senior</option>
                        <option value="MidLevel">MidLevel</option>
                        <option value="Junior">Junior</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button disabled={isSubmitting} className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Syncing...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}