import { toast } from '../utils/toast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createCompany, uploadImageCompany } from '../Api/companyService';
import Navbar from '../components/Navbar';

export default function CreateCompanyPage() {
  const navigate = useNavigate();

  // State الحقول الأساسية
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    description: ''
  });

  // State الصور والتحميل
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // منطق التحقق من البيانات
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Company name is required';
    if (!form.email.trim()) e.email = 'Official email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length < 20) e.description = 'Description must be at least 20 characters';
    return e;
  };

  // معالجة إرسال الفورم (التسلسل الجديد)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // المرحلة 1: إنشاء الشركة (JSON)

      const companyResponse = await createCompany(form);

      // الحصول على الـ ID من الرد (تأكد من مسمى الحقل في الـ Backend)
      const companyId = companyResponse.id || companyResponse.Id;

      if (!companyId) throw new Error("Company ID not returned from server");
      // المرحلة 2: رفع الصورة إذا تم اختيارها
      if (logoFile && companyId) {
        await uploadImageCompany(companyId, logoFile);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Process Error:", err);
      toast.error(err.message || "Failed to create company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // معالجة اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased">
      <Navbar />

      <div className="max-w-5xl mx-auto pt-32 pb-20 px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div>
            <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
              Register <span className="text-indigo-600">Company</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
              Doroop Business Portal
            </p>
          </div>
          <img src="/5.png" alt="Doroop" className="h-16 drop-shadow-xl" />
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-2 border-indigo-50 rounded-[4rem] p-16 text-center shadow-2xl shadow-indigo-100"
            >
              <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-green-100">
                <i className="fa-solid fa-check"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Success!</h2>
              <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                Your company profile has been created and branded successfully.
              </p>
              <button
                onClick={() => navigate('/home')}
                className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] py-5 px-12 rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
              >
                Go to Dashboard
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* القسم الأيسر: المعلومات */}
              <div className="lg:col-span-7 space-y-6 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100">
                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 block">01. Company Identity</h2>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Company Legal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TechNova"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-2 transition-all outline-none font-bold text-slate-700 ${errors.name ? 'border-rose-400 ring-4 ring-rose-50' : 'border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50'}`}
                    />
                    {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-4">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Official Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Headquarters</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Company Vision</label>
                    <textarea
                      rows="5"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-8 py-6 rounded-[2.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 resize-none"
                    />
                    {errors.description && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-4">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* القسم الأيمن: الصورة والرفع */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                  <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-10 block relative z-10">02. Visual Branding</h2>

                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex items-center justify-center relative group/upload overflow-hidden transition-all hover:border-indigo-400">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover p-2" />
                      ) : (
                        <div className="text-center p-4">
                          <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-200 group-hover/upload:text-indigo-400 transition-colors"></i>
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2">Upload Logo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 leading-tight">Join the <br/> ecosystem</h3>

                  <div className="flex flex-col gap-4 relative z-10">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                        loading ? 'bg-slate-700' : 'bg-indigo-600 hover:bg-white hover:text-slate-900 shadow-xl shadow-indigo-500/20'
                      }`}
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Launch Company'}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/home')}
                      className="w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}