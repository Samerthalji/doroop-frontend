import { toast } from '../utils/toast';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetails, deleteApplication } from '../Api/applicationService';
import { getJobById } from '../Api/jobService';

// إعدادات ألوان الحالات
const statusConfig = {
  Pending: { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Under Review', pulse: true },
  Accepted: { dot: 'bg-green-500', text: 'text-green-500', label: 'Accepted', pulse: false },
  Rejected: { dot: 'bg-red-500', text: 'text-red-500', label: 'Rejected', pulse: false },
};

export default function ReviewApplicationPage() {
  const { id } = useParams(); // معرف الطلب من الرابط
  const navigate = useNavigate();

  // حالات الصفحة
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. جلب تفاصيل الطلب من السيرفر
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getApplicationDetails(id);
        const data =await getJobById(response.data.jobId);

        // التعامل مع شكل استجابة السيرفر (سواء كانت البيانات مباشرة أو داخل data)
        const applicationData = data.data

        if (applicationData) {
          setApp(applicationData);
        } else {
          setError("No data found for this application.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Could not find this application details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  // 2. دالة سحب الطلب (Withdraw)
  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      setIsDeleting(true);
      await deleteApplication(id );
      toast.success("Your application has been withdrawn successfully.");
      navigate('/applications'); // العودة لصفحة كل الطلبات
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Failed to withdraw application.");
    } finally {
      setIsDeleting(false);
    }
  };

  // حالة التحميل
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading details...</p>
    </div>
  );

  // حالة الخطأ
  if (error || !app) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate('/applications')}
          className="text-indigo-600 font-bold hover:underline"
        >
          ← Back to My Applications
        </button>
      </div>
    </div>
  );

  const status = statusConfig[app.status] || statusConfig.Pending;

  return (
    <div className="bg-gray-50 antialiased font-sans min-h-screen pb-20">
      <div className="max-w-6xl mx-auto p-6" dir="ltr">

        {/* Header / Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center text-indigo-800 font-bold hover:text-indigo-600 transition-all">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to My Applications
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* الجانب الأيسر: تفاصيل الوظيفة */}
          <div className="lg:col-span-2 space-y-6">

            {/* بطاقة معلومات الوظيفة */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    <img
                      src={app.logoUrl || app.job?.companyLogo || '/default-company.png'}
                      alt="Company"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 leading-tight">
                      {app.jobTitle || app.job?.title || "Job Title"}
                    </h1>
                    <p className="text-indigo-600 font-bold text-lg">
                      {app.companyName || app.job?.companyName || "Company Name"}
                    </p>
                  </div>
                </div>
                <span className="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold">
                  {app.jobType || app.job?.jobType || "Full Time"}
                </span>
              </div>

              {/* شبكة المعلومات السريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-sack-dollar text-indigo-800"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Salary</p>
                    <p className="text-sm font-bold text-gray-800">{app.salary || app.job?.salary || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-location-dot text-indigo-800"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Location</p>
                    <p className="text-sm font-bold text-gray-800">{app.location || app.job?.location || 'Remote'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-briefcase text-indigo-800"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Experience</p>
                    <p className="text-sm font-bold text-gray-800">{app.experienceLevel || 'Entry Level'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-calendar text-indigo-800"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Applied On</p>
                    <p className="text-sm font-bold text-gray-800">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* الوصف الوظيفي */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-4">Job Description</h3>
              <div className="text-gray-600 leading-relaxed">
                {app.description || app.job?.description || "No description available."}
              </div>
            </div>
          </div>

          {/* الجانب الأيمن: حالة الطلب والإجراءات */}
          <aside className="space-y-6">

            {/* بطاقة الحالة */}
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-800 rounded-full opacity-20"></div>
              <h3 className="text-xs font-black mb-6 text-indigo-300 uppercase tracking-widest relative z-10">
                Application Status
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center bg-indigo-800/50 p-4 rounded-xl border border-indigo-700">
                  <div className={`w-3 h-3 rounded-full ${status.dot} mr-4 ${status.pulse ? 'animate-pulse' : ''}`}></div>
                  <div>
                    <p className="text-[10px] text-indigo-300 font-bold uppercase">Current Stage</p>
                    <p className="text-sm font-black uppercase tracking-wide">{status.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* خيار سحب الطلب (يظهر فقط إذا كان الطلب Pending) */}
            {  (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                <h4 className="text-red-800 font-black text-xs mb-2 uppercase">Danger Zone</h4>
                <p className="text-red-600 text-[11px] mb-4 leading-relaxed">
                  Decided not to pursue this role? You can withdraw your application. This action cannot be undone.
                </p>
                <button
                  onClick={handleWithdraw}
                  disabled={isDeleting}
                  className={`w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-black text-sm transition-all shadow-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:text-white'}`}
                >
                  {isDeleting ? 'Processing...' : 'Withdraw Application'}
                </button>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
}