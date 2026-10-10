import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { API_ROOT } from '../Api/apiClient';
import { toast } from '../utils/toast';
import { RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarArea } from 'recharts';

// Components
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import { useUser } from '../context/UserContext';
import RoadmapModal from '../components/RoadmapModal';

// مكوّن الرادار البصري
const SkillRadar = ({ userSkills, missingSkills }) => {
  // تحويل المهارات الحالية لأسماء lowercase للمقارنة
  const masteredNames = userSkills.map(s => (typeof s === 'string' ? s : (s?.skillName || s?.name || "")).toLowerCase());
  
  // دمج المهارات الموجودة والناقصة لعرضها في الرادار
  const data = (missingSkills || []).slice(0, 6).map(skill => {
    const name = skill.skillName || "Skill";
    const isMastered = masteredNames.includes(name.toLowerCase());
    return { subject: name, score: isMastered ? 100 : 30, fullMark: 100 };
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent animate-pulse" />
      <div className="relative z-10 text-left">
        <h3 className="text-white font-black italic uppercase tracking-tighter text-xl">Skill Precision Radar</h3>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Live AI Diagnostics</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.length > 0 ? data : [{subject: 'Analysis Ready', score: 0}]} >
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
              <RadarArea name="Skills" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState('to-learn');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) { setIsLoadingData(false); return; }
      try {
        const response = await axios.get(`Dashboard/${user.id}`);
        if (response.status === 200) setUser(prev => ({ ...prev, ...response.data }));
      } catch (e) { console.error(e); } finally { setIsLoadingData(false); }
    };
    fetchDashboardData();
  }, [user?.id, setUser]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    try {
      const updated = await axios.post(`Resume/upload-resume/${user.id}`, formData, {
        baseURL: API_ROOT, // Resume endpoints live under /api (not /api/v1)
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (updated.status === 200) {
        // تحديث البيانات فوراً بعد الرفع
        setUser(prev => ({ ...prev, ...updated.data }));
        window.location.reload(); // إعادة تحميل بسيطة لضمان تحديث الـ JSON Parse
      }
    } catch (e) { toast.error("Error analyzing the PDF. Please try again."); } finally { setIsUploading(false); }
  };

  const handleAnalyzeCurrentSkills = async () => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`Dashboard/analyze-profile/${user.id}`, {}, {
        baseURL: API_ROOT, // lives under /api (not /api/v1)
      });
      if (response.status === 200) setUser(prev => ({ ...prev, ...response.data }));
    } catch (e) { toast.error("AI analysis failed. Please try again."); } finally { setIsAnalyzing(false); }
  };

  // --- 🛡️ معالجة هيكلية الـ JSON الجديدة 🛡️ ---
  const rawRoadmap = user?.roadmapData ? JSON.parse(user.roadmapData) : null;
  const missingSkills = rawRoadmap?.missingSkills || [];
  const coursesData = rawRoadmap?.courses || [];
  
  const masteredSkills = user?.skills || [];
  const masteredNames = masteredSkills.map(s => (typeof s === 'string' ? s : (s?.skillName || s?.name || "")).toLowerCase());

  // تصفية المهارات التي لم يتم إتقانها بعد من الـ missingSkills
  const toLearn = missingSkills.filter(s => {
    const n = s?.skillName || "";
    return n && !masteredNames.includes(n.toLowerCase());
  });

  const needsUpload = !user?.targetTitle || user?.targetTitle === "Not Set" || user?.targetTitle === "";

  if (isLoadingData) return <div className="h-screen flex items-center justify-center font-black italic text-slate-300 animate-pulse">DOROOB SYSTEM...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased pb-20">
      <Navbar />
      
      <AnimatePresence>
        {isModalOpen && (
          <RoadmapModal
            data={coursesData} // نمرر مصفوفة الكورسات فقط للمودال
            userSkills={masteredSkills} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
          
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
            <LeftSidebar user={user} />
          </aside>

          <main className="flex-1 w-full max-w-[750px] mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {needsUpload ? (
                <motion.section key="setup" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[4rem] p-16 border border-slate-100 flex flex-col items-center text-center space-y-10 shadow-2xl relative"
                >
                  <div className="absolute top-0 inset-x-0 h-2 bg-indigo-600 rounded-t-full"></div>
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner font-bold italic">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  
                  <div className="max-w-md">
                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-4">Start AI Analysis</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Upload your CV to generate your personalized {new Date().getFullYear()} roadmap.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <input id="cv-upload-input" type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    <label 
                      htmlFor="cv-upload-input" 
                      className={`flex-1 p-8 rounded-3xl font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all shadow-2xl flex flex-col items-center gap-3 border-2 ${isUploading ? 'bg-slate-100 border-slate-200 cursor-not-allowed' : 'bg-slate-900 text-white border-transparent hover:bg-slate-800 hover:scale-105'}`}
                    >
                      {isUploading ? <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-file-pdf text-2xl text-rose-500"></i>}
                      {isUploading ? 'Analyzing...' : 'Upload CV (PDF)'}
                    </label>

                    <button 
                      onClick={handleAnalyzeCurrentSkills} 
                      disabled={isUploading || isAnalyzing}
                      className="flex-1 bg-indigo-600 text-white p-8 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-2xl flex flex-col items-center gap-3"
                    >
                      {isAnalyzing ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-wand-magic-sparkles text-2xl text-amber-400"></i>}
                      {isAnalyzing ? 'Scanning...' : 'Use Profile'}
                    </button>
                  </div>
                </motion.section>
              ) : (
                <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  {/* الرادار يستقبل المهارات الناقصة الجديدة */}
                  <SkillRadar userSkills={masteredSkills} missingSkills={missingSkills} />
                  
                  <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-left relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-brain"></i></div>
                      <div>
                         <h3 className="font-black text-slate-900 text-lg italic tracking-tighter uppercase">Target: {user.targetTitle}</h3>
                         <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">AI Strategy v3.0</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative z-10">
                      <p className="text-[13px] text-slate-600 font-bold italic leading-relaxed">"{user.aiRecommendation}"</p>
                    </div>
                  </section>

                  <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-black text-slate-900 text-xs uppercase italic tracking-tighter">Skill Hub</h3>
                      <div className="flex bg-white p-1 rounded-xl shadow-inner gap-1">
                        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 rounded-lg text-[10px] font-black uppercase bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
                          <i className="fa-solid fa-map mr-2"></i> View Full Roadmap
                        </button>
                        <div className="w-[1px] bg-slate-100 mx-1"></div>
                        {['to-learn', 'mastered'].map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {tab === 'to-learn' ? `To Learn (${toLearn.length})` : `Mastered`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 h-[400px] overflow-y-auto bg-white text-left custom-scrollbar">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(activeTab === 'to-learn' ? toLearn : masteredSkills).map((skill, i) => {
                          const name = typeof skill === 'string' ? skill : (skill?.skillName || skill?.name || "Skill");
                          const impact = skill?.impactPercentage ? `${skill.impactPercentage}%` : null;
                          return (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              transition={{ delay: i * 0.05 }}
                              key={i} 
                              className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-200 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs ${activeTab === 'to-learn' ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-emerald-500 text-white'}`}>
                                  <i className={`fa-solid ${activeTab === 'to-learn' ? 'fa-rocket' : 'fa-check'}`}></i>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-black text-slate-900 text-[13px] uppercase italic">{name}</span>
                                  {impact && <span className="text-[9px] text-indigo-500 font-black tracking-widest uppercase">Impact: {impact}</span>}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-32 h-fit">
            <RightPanel variant="home" />
          </aside>
        </div>
      </div>
    </div>
  );
}