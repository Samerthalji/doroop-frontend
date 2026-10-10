import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CompanySidebar from '../components/CompanySidebar';

const CompanySettings = () => {
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAdminModal, setShowAdminModal] = useState(false);

  // 1. بيانات الملف الشخصي
  const [profileData, setProfileData] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    location: '',
    about: '',
    logo: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);

  // 2. بيانات الأمان
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 3. قائمة الأدمنز (بيانات تجريبية)
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Ahmad Ali', email: 'ahmad@doroop.com', role: 'Owner' },
    { id: 2, name: 'Sara Omar', email: 'sara@doroop.com', role: 'Recruiter' }
  ]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Recruiter' });

  useEffect(() => {
    setProfileData({
      name: 'Doroop Tech',
      website: 'https://doroop.com',
      industry: 'Technology',
      size: '11-50',
      location: 'Amman, Jordan',
      about: 'We build future tech solutions for businesses.',
      logo: ''
    });
  }, [companyId]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleSecurityChange = (e) => setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  const handleAdminChange = (e) => setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'تم تحديث ملف الشركة بنجاح!' });
    }, 1000);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمات المرور الجديدة غير متطابقة!' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    setAdmins([...admins, { id: Date.now(), ...newAdmin }]);
    setShowAdminModal(false);
    setNewAdmin({ name: '', email: '', role: 'Recruiter' });
    setMessage({ type: 'success', text: 'تم إضافة الأدمن الجديد بنجاح!' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* السايدبار الخاص بك */}
      <CompanySidebar 
        companyId={companyId} 
        companyName={profileData.name} 
        companyLogo={logoPreview || profileData.logo} 
      />

      {/* منطقة المحتوى الموسطة بالكامل */}
      <div className="flex-1 p-8 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">Company Settings</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your business profile, security, and team</p>
          </div>

          {/* Tabs Control */}
          <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto justify-center sm:justify-start">
            {[
              { id: 'profile', label: 'Company Profile', icon: 'fa-building' },
              { id: 'security', label: 'Security & Access', icon: 'fa-shield-halved' },
              { id: 'team', label: 'Manage Admins', icon: 'fa-users' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
                className={`pb-4 px-2 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-sm`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Alert Feedback */}
          {message.text && (
            <div className={`p-4 rounded-2xl mb-6 font-bold text-xs uppercase tracking-widest flex items-center gap-3 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}>
              <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-lg`}></i>
              {message.text}
            </div>
          )}

          {/* Content Box (الواجهة البيضاء) */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile */}
              {activeTab === 'profile' && (
                <motion.form key="profile-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                    <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden border-2 border-indigo-100 flex items-center justify-center">
                      {logoPreview || profileData.logo ? (
                        <img src={logoPreview || profileData.logo} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <i className="fa-solid fa-building text-3xl text-slate-400"></i>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all inline-block shadow-lg shadow-indigo-600/10">
                        <i className="fa-solid fa-camera mr-2"></i> Upload New Logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                      <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Website URL</label>
                      <input type="url" name="website" value={profileData.website} onChange={handleProfileChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry</label>
                      <select name="industry" value={profileData.industry} onChange={handleProfileChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all">
                        <option value="Technology">Technology & Software</option>
                        <option value="Finance">Finance & Banking</option>
                        <option value="Healthcare">Healthcare & Medical</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Size</label>
                      <select name="size" value={profileData.size} onChange={handleProfileChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all">
                        <option value="1-10">1 - 10 Employees</option>
                        <option value="11-50">11 - 50 Employees</option>
                        <option value="51-200">51 - 200 Employees</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Headquarters Location</label>
                      <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">About Company</label>
                      <textarea name="about" value={profileData.about} onChange={handleProfileChange} rows="4" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all resize-none"></textarea>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md shadow-indigo-600/10">
                      {loading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : <i className="fa-solid fa-floppy-disk mr-2"></i>} Save Changes
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Tab 2: Security */}
              {activeTab === 'security' && (
                <motion.form key="security-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 max-w-xl">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                      <input type="password" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                      <input type="password" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all">
                      Update Password
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Tab 3: Admins Management (إدارة الأدمنز والزر المضاف) */}
              {activeTab === 'team' && (
                <motion.div key="team-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Team Members</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Manage who has access to this dashboard</p>
                    </div>
                    {/* زر إضافة أدمن جديد */}
                    <button 
                      onClick={() => setShowAdminModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                    >
                      <i className="fa-solid fa-user-plus text-xs"></i> Add New Admin
                    </button>
                  </div>

                  {/* جدول عرض الأدمنز الحاليين */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                        {admins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-slate-50/80 transition-all">
                            <td className="py-4 px-4 font-black text-slate-900">{admin.name}</td>
                            <td className="py-4 px-4 text-slate-500">{admin.email}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${admin.role === 'Owner' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                                {admin.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Admin Addition Popup Modal (نافذة إضافة أدمن منبثقة) */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] border border-slate-200 w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Add New Admin</h3>
                <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-600 transition-all">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <form onSubmit={handleAddAdminSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" name="name" value={newAdmin.name} onChange={handleAdminChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" name="email" value={newAdmin.email} onChange={handleAdminChange} required className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Role / Permission</label>
                  <select name="role" value={newAdmin.role} onChange={handleAdminChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all">
                    <option value="Recruiter">Recruiter (صلاحية توظيف فقط)</option>
                    <option value="Admin">Admin (كامل الصلاحيات)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10">Add Member</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompanySettings;