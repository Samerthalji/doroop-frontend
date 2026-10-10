import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RightPanel from '../components/RightPanel';
import LeftSidebar from '../components/LeftSidebar';
import { useUser } from '../context/UserContext';
import { getMyApplications } from '../Api/applicationService';

const statusConfig = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Pending'
  },
  Accepted: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Accepted'
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Rejected'
  },
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        setLoading(true);

        const response = await getMyApplications(1, 50);

        const dataArray = response.data?.applications || response.data?.items || response.data || [];

        if (Array.isArray(dataArray)) {
          setApplications(dataArray);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching my applications:", err);
        setError("Failed to load your applications.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApps();
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased pb-20">
      <Navbar />

      <div className="max-w-[1440px] mx-auto pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start text-left">

          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
            <LeftSidebar user={user} />
          </aside>

          <main className="flex-1 w-full max-w-[750px] mx-auto space-y-8">

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative z-10">
                <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">My Applications</h1>
                <p className="text-sm text-slate-500 font-medium">Track your AI-powered career progress</p>
              </div>
              <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl relative z-10">
                {applications.length} Total
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-black italic uppercase text-[10px] tracking-widest">Doroob System Syncing...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-600 p-8 rounded-[2.5rem] border border-rose-100 text-center font-bold">
                {error}
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-briefcase text-3xl text-slate-200"></i>
                </div>
                <p className="text-slate-500 font-bold italic">No active applications found.</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
                >
                  Explore New Roles
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map(app => {
                  const status = statusConfig[app.status] || statusConfig.Pending;
                  return (
                    <div key={app.id} className="bg-white border border-slate-100 p-7 rounded-[3rem] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">

                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 w-16 h-16 flex items-center justify-center shadow-inner group-hover:bg-white transition-colors">
                            <img
                              src={ `${app.companyLogoUrl||'/googleLogo.png'}`}
                              alt="Company"
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                              {app.jobTitle || app.title}
                            </h3>
                            <p className="text-indigo-600 font-black uppercase text-[11px] tracking-widest">
                              {app.companyName || app.company}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${status.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot} ${app.status === 'Pending' ? 'animate-pulse' : ''}`}></span>
                          {status.label}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 mt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                          <i className="fa-solid fa-sack-dollar text-indigo-400 text-sm"></i>
                          <span>{app.salary || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                          <i className="fa-solid fa-layer-group text-indigo-400 text-sm"></i>
                          <span>{app.jobType || 'Full Time'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                          <i className="fa-solid fa-calendar-check text-indigo-400 text-sm"></i>
                          <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                          <i className="fa-solid fa-location-crosshairs text-indigo-400 text-sm"></i>
                          <span className="truncate">{app.location || 'Remote'}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <button
                          onClick={() => navigate(`/review-application/${app.applicationId}`)}
                          className="w-full bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 hover:bg-slate-900 hover:text-white group-hover:shadow-lg flex items-center justify-center gap-3"
                        >
                          <i className="fa-solid fa-fingerprint text-xs text-indigo-500 group-hover:text-white"></i>
                          Access Application Intelligence
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-32 h-fit">
            <RightPanel variant="applications" />
          </aside>

        </div>
      </div>
    </div>
  );
}