import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { API_ROOT } from '../Api/apiClient';
import { toast } from '../utils/toast';
import Navbar from '../components/Navbar';
import { getUserProfile, updateUserInfo, updateUserProfile } from '../Api/userService';
import { deleteSkill, addSkill as addSkillAPI } from '../Api/skillService';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// مكون المودال (Glassmorphism)
const EditModal = ({ title, isOpen, onClose, onSave, children, showSave = true }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{title}</h3>
            <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
          </div>
          <div className="p-10 max-h-[60vh] overflow-y-auto">
            {children}
            {showSave && (
              <button
                onClick={onSave}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
              >
                Save Changes
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [skills, setSkills] = useState([]);
  const [myCompanies, setMyCompanies] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const { user: globalUser, setUser: updateGlobalUser } = useUser();
  const [editData, setEditData] = useState({ fName: '', lName: '', headline: '', about: '' });

  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileData, companiesRes] = await Promise.all([
          getUserProfile(),
          axios.get('/company/my-companies').catch(() => ({ data: [] }))
        ]);

        setUser(profileData);
        setSkills(profileData.skills || []);
        setMyCompanies(companiesRes.data || []);
        setEditData({
          fName: profileData.fName || '',
          lName: profileData.lName || '',
          headline: profileData.headline || '',
          about: profileData.about || ''
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleUpdateInfo = async () => {
    try {
      setLoading(true);
      await updateUserInfo(editData);
      const updatedUser = { ...user, ...editData };
      setUser(updatedUser);
      updateGlobalUser(updatedUser);
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      setLoading(true);

      // 1. نرسل المهارة للباكند لتخزينها في الداتابيز
      const response = await addSkillAPI({ addSkillRequest: newSkill });

      const cleanNewSkill = {
        skillId: response?.skillId || response?.SkillId || response?.id || Date.now(),
        skillName: newSkill.trim() // 👈 نأخذ النص الصافي اللي أنت كتبته مباشرة!
      };

      // 3. نحدث الـ State فوراً ليظهر المربع وبداخله النص
      setSkills(prevSkills => [...prevSkills, cleanNewSkill]);
      setNewSkill("");
      setActiveModal(null);
    } catch (err) {
        console.error("Error adding skill:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleRemoveSkill = async (id) => {
    try {
      setLoading(true);
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.skillId !== id));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('File', file);
    try {
      setLoading(true);
      await updateUserProfile(formData);
      const updatedData = await getUserProfile();
      setUser(updatedData);
      updateGlobalUser(updatedData);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [updateGlobalUser]);

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !globalUser?.id) return;
    const formData = new FormData();
    formData.append('File', file);

    try {
      setCvAnalyzing(true);
      // Resume endpoints live under /api (not /api/v1), hence the baseURL override.
      await axios.post(`Resume/upload-resume/${globalUser.id}`, formData, {
        baseURL: API_ROOT,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Re-fetch instead of reloading the page, so the toast stays visible.
      const updatedData = await getUserProfile();
      setUser(updatedData);
      setSkills(updatedData.skills || []);
      updateGlobalUser(updatedData);
      toast.success("CV analyzed and profile updated.");
    } catch (err) {
      console.error(err);
      toast.error("CV analysis failed. Please try again.");
    } finally { setCvAnalyzing(false); }
  };

  if (loading && !user) return <ProfileSkeleton />;

  return (
    <div className="bg-[#F9FAFC] min-h-screen pt-24 pb-12 font-sans">
      <Navbar />

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <input type="file" ref={cvInputRef} onChange={handleCVUpload} className="hidden" accept=".pdf,.doc,.docx" />

      <main className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[4rem] shadow-xl border border-white overflow-hidden mb-8 relative">
          <div className="h-44 bg-slate-900 relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          <div className="px-10 pb-12 relative flex flex-col items-center -mt-20">
            <div className="relative mb-6">
              <img
                src={user?.profileImageUrl || '/Abood.png'}
                className="w-40 h-40 rounded-[3.5rem] border-8 border-white shadow-2xl object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => fileInputRef.current.click()}
                alt="Profile"
              />
              <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white hover:bg-slate-900 transition-colors">
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>

            <div className="text-center group cursor-pointer" onClick={() => setActiveModal('identity')}>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center justify-center gap-3">
                {user?.fName} {user?.lName}
                <i className="fa-solid fa-pen text-[10px] text-slate-200 group-hover:text-indigo-600 transition-colors"></i>
              </h1>
              <p className="text-indigo-600 font-bold text-xl mt-1 italic uppercase tracking-tighter">{user?.headline || "Software Engineer"}</p>
            </div>

            <div className="mt-8 w-full px-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-left w-full">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 text-xl border border-slate-100">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">AI Profile Sync</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Upload PDF to auto-update skills</p>
                        </div>
                    </div>
                    <button
                        onClick={() => cvInputRef.current.click()}
                        disabled={cvAnalyzing}
                        className={`whitespace-nowrap px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            cvAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600'
                        }`}
                    >
                        {cvAnalyzing ? 'Analyzing...' : 'Upload CV'}
                    </button>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 w-full text-center group cursor-pointer" onClick={() => setActiveModal('about')}>
              <p className="text-slate-500 leading-relaxed italic px-6 font-medium text-lg">
                "{user?.about || "Add a professional bio to stand out..."}"
                <i className="fa-solid fa-pen text-[10px] text-slate-200 ml-2 group-hover:text-indigo-600 transition-colors"></i>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-10">
              <AnimatePresence>
                {skills.map((s) => (
                  <motion.span key={s.skillId} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 shadow-sm hover:border-rose-100 group"
                  >
                    {s.skillName}
                    <button onClick={() => handleRemoveSkill(s.skillId)} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark"></i></button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <button onClick={() => setActiveModal('skills')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all">+ Add Skill</button>
            </div>

            <div className="mt-12 w-full border-t border-slate-100 pt-10 px-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] flex items-center justify-center text-indigo-400 text-2xl shadow-inner">
                      <i className="fa-solid fa-building-circle-check"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-tighter text-xl italic">Grow Your Business</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Manage or create company profiles</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal('myCompanies')}
                      className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      My Companies ({myCompanies.length})
                    </button>
                    <button
                      onClick={() => navigate('/create-company')}
                      className="px-6 py-4 bg-indigo-600 hover:bg-white hover:text-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                    >
                      Create +
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* مودال الشركات */}
      <EditModal
        title="My Companies"
        isOpen={activeModal === 'myCompanies'}
        onClose={() => setActiveModal(null)}
        showSave={false}
      >
        <div className="space-y-4">
          {myCompanies.length > 0 ? myCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer hover:bg-white group"
              onClick={() => navigate(`/company-dashboard/${company.id}`)} // التوجيه للداشبورد الخاص بالشركة
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                   {company.logo ? <img src={company.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : <i className="fa-solid fa-building"></i>}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-tighter">{company.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Click to open dashboard</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                <i className="fa-solid fa-arrow-right text-indigo-600 text-xs"></i>
              </div>
            </div>
          )) : (
            <p className="text-center text-slate-400 font-bold py-4 italic">No companies managed yet.</p>
          )}
        </div>
      </EditModal>

      {/* باقي المودالات */}
      <EditModal title="Edit Identity" isOpen={activeModal === 'identity'} onClose={() => setActiveModal(null)} onSave={handleUpdateInfo}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="First Name" value={editData.fName} onChange={(e) => setEditData({...editData, fName: e.target.value})} />
            <input className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Last Name" value={editData.lName} onChange={(e) => setEditData({...editData, lName: e.target.value})} />
          </div>
          <input className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Headline" value={editData.headline} onChange={(e) => setEditData({...editData, headline: e.target.value})} />
        </div>
      </EditModal>

      <EditModal title="Edit Bio" isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} onSave={handleUpdateInfo}>
        <textarea rows="5" className="w-full p-5 rounded-3xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" value={editData.about} onChange={(e) => setEditData({...editData, about: e.target.value})} />
      </EditModal>

      <EditModal title="New Skill" isOpen={activeModal === 'skills'} onClose={() => setActiveModal(null)} onSave={handleAddSkill}>
        <input className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Skill name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} autoFocus />
      </EditModal>
    </div>
  );
}