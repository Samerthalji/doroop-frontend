import { enterDemo } from '../demo/demoMode';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Api/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUser } = useUser();
  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'صيغة البريد غير صحيحة';
    if (!form.password) e.password = 'كلمة المرور مطلوبة';
    return e;
  };

  // تحديث البيانات وتصفير الأخطاء فوراً عند الكتابة
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name] || errors.server) {
      setErrors({ ...errors, [name]: null, server: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const userData = await login(form);
      // axios بيمسك status 200 تلقائياً
      if (userData && (userData.status === 200 || userData.token)) {
        if (userData.token) localStorage.setItem('token', userData.token);
       await fetchUser();
        navigate('/home');
      }
    } catch (error) {
      console.error("Login Error:", error.response);
      const serverMessage = error.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      setErrors({ server: serverMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 antialiased font-sans min-h-screen flex items-center justify-center p-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-6xl h-[700px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* القسم الأيسر: الصورة والترحيب */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-indigo-900">
          <img src="/login-bg.webp" alt="Career" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
          <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
            <h1 className="text-4xl text-center lg:text-5xl font-extrabold mb-6 leading-tight text-right" dir="rtl">
              أهلاً بك مجدداً في <br /> <span className="text-indigo-400">دُروب</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-md leading-relaxed text-right" dir="rtl">
              خطوتك المهنية القادمة بانتظارك. سجل دخولك لترى من يبحث عن مهاراتك اليوم.
            </p>
          </div>
        </div>

        {/* القسم الأيمن: نموذج الدخول */}
        <div className="w-full md:w-1/2 p-4 lg:p-10 flex flex-col justify-center bg-white">
          <img src="/5.png" alt="Logo" className="w-40 mx-auto" />
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold mb-2 text-blue-800">Login to Account</h2>
            <p className="text-indigo-900">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* رسالة خطأ السيرفر (بديل الـ Alert) */}
            <AnimatePresence>
              {errors.server && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-2 justify-center"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errors.server}
                </motion.div>
              )}
            </AnimatePresence>

            {/* حقل الإيميل */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2 px-5">Email Address</label>
              <input 
                name="email"
                type="email" 
                placeholder="name@example.com"
                value={form.email} 
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all ${errors.email ? 'border-red-400 focus:ring-red-50' : 'border-gray-100 focus:ring-indigo-500/20 focus:border-indigo-500'}`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 px-5">{errors.email}</p>}
            </div>

            {/* حقل الباسورد مع العين */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-indigo-900 px-5">Password</label>
                <Link to="/forgot-password" size="sm" className="text-sm text-blue-800 font-bold hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all ${errors.password ? 'border-red-400 focus:ring-red-50' : 'border-gray-100 focus:ring-indigo-500/20 focus:border-indigo-500'}`} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 px-5">{errors.password}</p>}
            </div>



            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-indigo-700'} text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.99] mt-4`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : 'Login'}
            </button>
          </form>

        <p className="text-center mt-4 text-gray-500">
            Don't have an account? <Link to="/signup" className="text-blue-800 font-extrabold hover:underline">Sign Up</Link>
          </p>

          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-sm text-gray-500 mb-3">Just looking around? No sign-up needed.</p>
            <button
              type="button"
              onClick={enterDemo}
              className="w-full rounded-2xl border border-blue-800 py-3 font-bold text-blue-800 transition-all hover:bg-blue-50"
            >
              Explore the demo
            </button>
          </div>
        </div> {/* نهاية قسم الفورم */}
      </motion.div> {/* هاد هو التاغ اللي كان ناقص وبسببه طلع الخطأ */}
    </div>
  );
}