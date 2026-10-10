import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import JobCard from '../components/JobCard';
import { useJobs } from '../context/JobContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedJobsPage() {
  const { loading, savedJobs, savedJobIds, toggleSaveJob } = useJobs();
  const { user } = useUser();
  
  const [search, setSearch] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [experience, setExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 4;

  const toggleJobType = (type) => {
    const formatted = type.replace(/\s+/g, '');
    setJobTypes(prev => prev.includes(formatted) ? prev.filter(t => t !== formatted) : [...prev, formatted]);
  };

  const handleUnsave = (id) => {
    const job = savedJobs.find(j => j.id === id);
    if (job) toggleSaveJob(job);
  };

  // --- Filtering Logic ---
  const filtered = savedJobs.filter(job => {
    const title   = (job.title   || job.jobTitle   || '').toLowerCase();
    const company = (job.company || job.companyName || '').toLowerCase();
    const q       = search.toLowerCase();

    const titleMatch   = title.includes(q);
    const companyMatch = company.includes(q);

    const matchType = jobTypes.length === 0 || jobTypes.some(t => {
      const jobTypeData = (job.type || job.jobType || job.typeJob || '').replace(/\s+/g, '').toLowerCase();
      return jobTypeData.includes(t.toLowerCase());
    });

    const matchExp = !experience || (job.experience || job.experienceLevel || '').toLowerCase().includes(experience.toLowerCase());

    return (titleMatch || companyMatch) && matchType && matchExp;
  });

  const totalPages = Math.ceil(filtered.length / jobsPerPage);
  const paginated = filtered.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased pb-20">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
          
          {/* الجانب الأيسر: Sticky Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
            <LeftSidebar user={user} />
          </aside>

          {/* المحتوى الرئيسي */}
          <main className="flex-1 w-full max-w-[750px] mx-auto space-y-8">
            
            {/* الهيدر العلوي */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50/50 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative z-10">
                <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Saved Opportunities</h1>
                <p className="text-sm text-slate-500 font-medium">Your curated list of future careers</p>
              </div>
              <div className="bg-rose-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl relative z-10">
                {savedJobs.length} Saved
              </div>
            </div>

            {/* لوحة التحكم والبحث */}
            <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 relative">
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search in your saved jobs..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold text-slate-700 outline-none shadow-inner transition-all"
                />
                <i className="fa-solid fa-bookmark absolute left-6 top-1/2 -translate-y-1/2 text-rose-400"></i>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
                <div>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] block mb-4">Job Type</span>
                  <div className="flex flex-wrap gap-2">
                    {['Full Time', 'Part Time', 'Remote'].map(type => {
                      const formatted = type.replace(/\s+/g, '');
                      const isActive = jobTypes.includes(formatted);
                      return (
                        <button
                          key={type}
                          onClick={() => { toggleJobType(type); setCurrentPage(1); }}
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${
                            isActive 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-rose-200 hover:text-rose-600'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] block mb-4">Experience Level</span>
                  <select
                    value={experience}
                    onChange={e => { setExperience(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[11px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-inner appearance-none uppercase tracking-widest"
                  >
                    <option value="">All Experience Levels</option>
                    <option value="fresh">Fresh / Entry Level</option>
                    <option value="junior">Junior Level</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>
            </section>

            {/* قائمة الوظائف المحفوظة */}
            <div className="space-y-6">
              {loading && savedJobIds.length > 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Syncing Vault...</p>
                </div>
              ) : paginated.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold italic">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <i className="fa-regular fa-folder-open text-3xl text-slate-200"></i>
                  </div>
                  No saved jobs found matching these filters.
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {paginated.map(job => (
                    <motion.div 
                      key={job.id} 
                      layout 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="group"
                    >
                      <JobCard 
                        job={job} 
                        showUnsave 
                        onUnsave={handleUnsave} 
                        savedJobs={savedJobIds} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-3 pt-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm ${
                      currentPage === i + 1 
                      ? 'bg-slate-900 text-white shadow-xl scale-110' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>

          {/* الجانب الأيمن: Sticky Panel */}
          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-32 h-fit">
            <RightPanel variant="saved" />
            <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-rose-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                <h4 className="font-black text-lg italic mb-2 uppercase tracking-tighter">Vault Security</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Your saved jobs are synced across all your devices.</p>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}