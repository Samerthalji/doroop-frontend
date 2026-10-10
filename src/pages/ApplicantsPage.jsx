import { toast } from '../utils/toast';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getApplicationDetails, getJobApplications } from '../Api/applicationService'; // تأكد من المسار الصحيح

const ApplicantsPage = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // لتخزين تفاصيل الطلب عند النقر
  const [isModalOpen, setIsModalOpen] = useState(false);
   const { companyId, jobId } = useParams();

  // بيانات ستاتيك للعرض الأساسي
  const [applicants,setApplicants] = useState([]);

useEffect(() => {
  let timer;

  const getUserApplication = async () => {
    try {
const res = await getJobApplications({
   jobId: Number(jobId),
   companyId: Number(companyId),
   pageNumber: 1,
   pageSize: 10
});
      setApplicants(res.data.items);

      timer = setTimeout(() => {
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  getUserApplication();

  return () => clearTimeout(timer);
}, [jobId, companyId]);

  // --- دالة شبك الـ API لجلب التفاصيل ---
  const handleInspectCV = async (applicationId) => {
    try {
      setLoading(true);
      const response = await getApplicationDetails(applicationId);
      setSelectedApp(response.data || response); // تخزين البيانات القادمة من الباكند
      setIsModalOpen(true); // فتح النافذة لعرض البيانات
    } catch (error) {
      console.error("فشل في جلب تفاصيل الطلب:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              Applicants <span className="text-indigo-600">Queue</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] mt-3 uppercase tracking-[0.3em]">
              Reviewing Candidates for Job #{jobId}
            </p>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                <th className="px-12 py-8">Candidate</th>
                <th className="px-12 py-8">Status</th>
                <th className="px-12 py-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-12 py-7">
                    <div className="flex items-center gap-4">
                   <div
  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
    app.avatarColor || "from-indigo-500 to-blue-600"
  } flex items-center justify-center text-white font-black shadow-lg`}
>
  {app.userName?.charAt(0).toUpperCase() || "U"}
</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-indigo-600 transition-colors">{app.userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{app.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-7">
                    <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                      {app.status}
                    </span>
                  </td>
                  <td className="px-12 py-7 text-right">
                    <button
onClick={() => window.open(app.cvUrl, "_blank")}                      className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-90"
                    >
                      Inspect CV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal لعرض تفاصيل الـ API القادمة --- */}
      <AnimatePresence>
        {isModalOpen && selectedApp && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl p-12 shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors text-2xl">
                <i className="fa-solid fa-circle-xmark"></i>
              </button>

              <h2 className="text-3xl font-black uppercase italic mb-8">Candidate <span className="text-indigo-600">Details</span></h2>

              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem]">
                  <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black italic">
                    {selectedApp.userName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedApp.userName}</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{selectedApp.userEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="p-6 bg-slate-50 rounded-[2rem]">
                    <p className="text-[10px] font-black text-indigo-500 uppercase mb-2">Applied Date</p>
                    <p className="font-bold text-slate-700">{applicants[0]?.appliedAt?.split('T')[0]}</p>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                  <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest">Candidate Message / Bio</p>
                  <p className="text-sm font-medium leading-relaxed italic opacity-80">
                    "{selectedApp.coverLetter || "No cover letter provided for this application."}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantsPage;