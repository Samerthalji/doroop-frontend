import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import JobCard from '../components/JobCard';
import { useJobs } from '../context/JobContext';
import { useUser } from '../context/UserContext';

export default function JobsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { jobs, loading, fetchJobs, fetchJobsBySkill, savedJobIds, toggleSaveJob } = useJobs();
  
  const [search, setSearch] = useState('');
  const [jobTypes, setJobTypes] = useState([]); 
  const [experience, setExperience] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isSkillSearch, setIsSkillSearch] = useState(false);
  const jobsPerPage = 4;

  // --- التأثير الأساسي: جلب الوظائف بناءً على مهارات المستخدم عند فتح الصفحة ---
  useEffect(() => {
    const loadInitialJobs = async () => {
      // إذا كان المستخدم يمتلك مهارات في ملفه الشخصي
      if (user?.skills && user.skills.length > 0) {
        setIsSkillSearch(true);
        // نأخذ أول مهارة (أو دمج مهارات) للبحث الأولي
        const primarySkill = user.skills[0].skillName;
        setSearch(primarySkill); 
        await fetchJobsBySkill(primarySkill, 1, 50);
      } else {
        // إذا لم توجد مهارات، نعرض كل الوظائف المتاحة
        setIsSkillSearch(false);
        await fetchJobs();
      }
    };

    loadInitialJobs();
  }, [user, fetchJobs, fetchJobsBySkill]);

  // --- Handlers ---
  const handleSearch = async () => {
  const value = search.trim();

  setCurrentPage(1);

  // إذا فارغ
  if (!value) {
    setIsSkillSearch(false);
    await fetchJobs(); // رجع كل الوظائف
    return;
  }

  try {
    setIsSkillSearch(true);
    await fetchJobsBySkill(value, 1, 50);
  } catch (error) {
    console.error(error);
  }
};
  const handleClearSearch = async () => {
    setSearch('');
    setIsSkillSearch(false);
    setCurrentPage(1);
    setJobTypes([]);
    setExperience('');
    await fetchJobs();
  };

  const toggleJobType = (type) => {
    const formattedType = type.replace(/\s+/g, ''); 
    setJobTypes(prev =>
      prev.includes(formattedType) ? prev.filter(t => t !== formattedType) : [...prev, formattedType]
    );
    setCurrentPage(1);
  };

  // --- Filtering Logic ---
  const filteredJobs = jobs.filter(job => {
    const matchType = jobTypes.length === 0 || jobTypes.some(t => {
      const jobTypeData = (job.type || job.jobType || "").replace(/\s+/g, '').toLowerCase();
      return jobTypeData.includes(t.toLowerCase());
    });
    const matchExp = !experience || (job.experience || "").toLowerCase().includes(experience.toLowerCase());
    return matchType && matchExp;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased pb-20">
      <Navbar />

      <div className="max-w-[1440px] mx-auto pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
          
          {/* الجانب الأيسر: Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
            <LeftSidebar user={user} />
          </aside>

          {/* المنتصف: القائمة الرئيسية */}
          <main className="flex-1 w-full max-w-[750px] mx-auto space-y-8">
            
            {/* الهيدر العلوي الذكي */}
            <div className="flex items-center justify-between px-2">
              <div>
                <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                  {isSkillSearch ? "Recommended for you 🎯" : "Explore Jobs 🚀"}
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  {isSkillSearch 
                    ? `Showing positions matching: ${search}` 
                    : "Find your next AI-matched career move"}
                </p>
              </div>
              <div className="hidden sm:block bg-indigo-600 text-white px-5 py-2 rounded-2xl shadow-lg font-black text-[10px] uppercase tracking-widest">
                {filteredJobs.length} Positions Found
              </div>
            </div>

            {/* لوحة البحث والفلاتر */}
            <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/40 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search skills (React, .NET, UI/UX)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-14 pr-36 py-5 rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 outline-none shadow-inner transition-all"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button onClick={handleSearch} className="bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                    Search
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] block mb-4">Employment Type</span>
                  <div className="flex flex-wrap gap-2">
                    {['Full Time', 'Part Time', 'Remote'].map(type => {
                      const formatted = type.replace(/\s+/g, '');
                      const isActive = jobTypes.includes(formatted);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleJobType(type)}
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${
                            isActive 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] block mb-4">Experience Level</span>
                  <select 
                    value={experience}
                    onChange={(e) => { setExperience(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[11px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner appearance-none uppercase tracking-widest"
                  >
                    <option value="">All Experience Levels</option>
                    <option value="fresh">Fresh / Entry Level</option>
                    <option value="junior">Junior Level</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>

              {isSkillSearch && (
                <div className="mt-6 flex justify-end">
                  <button onClick={handleClearSearch} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-circle-xmark"></i> Clear Personalization
                  </button>
                </div>
              )}
            </section>

            {/* قائمة الوظائف */}
            <div className="grid gap-6">
              {loading ? (
                <div className="py-24 text-center space-y-4 bg-white rounded-[3rem] border border-slate-100">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] italic">Scanning Opportunities...</p>
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map(job => (
                      <motion.div key={job.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <JobCard job={job} savedJobs={savedJobIds} onSave={() => toggleSaveJob(job)} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold italic">
                      <i className="fa-solid fa-ghost text-4xl mb-4 block opacity-20"></i>
                      No matches found for "{search}".
                    </div>
                  )}
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
                      ? 'bg-slate-900 text-white shadow-indigo-100 shadow-xl scale-110' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>

          {/* الجانب الأيمن */}
          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-32 h-fit space-y-8">
            <RightPanel variant="jobs" />
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 blur-[50px]" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <i className="fa-solid fa-bookmark text-rose-400 text-sm" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">Saved Jobs</h4>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Your shortlist</p>
                </div>
              </div>
              <div className="text-5xl font-black text-white relative z-10 mb-1">{savedJobIds.length}</div>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-5 relative z-10">
                {savedJobIds.length === 1 ? 'Position saved' : 'Positions saved'}
              </p>
              <button
                onClick={() => navigate('/saved')}
                className="w-full bg-white/10 hover:bg-rose-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 border border-white/10 hover:border-rose-500 relative z-10"
              >
                <i className="fa-solid fa-arrow-right mr-2" />
                View Saved Jobs
              </button>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}