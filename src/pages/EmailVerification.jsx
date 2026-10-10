import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VerifyEmail } from '../Api/authService';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // حالة جديدة لتخزين رسالة الخطأ
  const [errorMessage, setErrorMessage] = useState('');
  
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  // منع الدخول للصفحة إذا لم يكن هناك إيميل
  useEffect(() => {
    if (!userEmail) {
       navigate("/signup"); // فعلها وقت الحاجة
    }
  }, [userEmail, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    // تصفير أي رسالة خطأ سابقة قبل المحاولة الجديدة
    setErrorMessage('');
    setLoading(true);

    try {
      const credentials = {
        email: userEmail,
        code: otp
      };

      const response = await VerifyEmail(credentials);

      if (response && response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      
      // استخراج رسالة الخطأ الحقيقية من الباك آند
      const serverError = error.errors?.Code?.[0] || "الرمز غير صحيح، يرجى المحاولة مرة أخرى";
      
      // تخزين الرسالة في الـ State بدل الـ alert
      setErrorMessage(serverError);
      
      // تصفير حقل الـ OTP عشان يرجع يحاول
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white md:bg-[#F0F2F5] flex items-center justify-center p-4 font-sans" dir="rtl">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="input-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-[440px] bg-white md:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] md:rounded-2xl p-8 text-center"
          >
            {/* Logo / Title Section */}
            <div className="mb-8">
 <img src="/5.png" className='p-[30px]' alt="Doroob Logo" />
               <h2 className="text-[20px] font-bold text-[#1c1e21] mb-2">أدخل رمز التأكيد</h2>
              <p className="text-[15px] text-[#606770] leading-6">
                يرجى إدخال الرمز المكون من 6 أرقام الذي أرسلناه إلى: <br/>
                <span className="font-bold text-slate-800 tracking-tight" dir="ltr">{userEmail || "بريدك الإلكتروني"}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4 relative">
              
              {/* رسالة الخطأ الاحترافية (Error Message) */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.p
                    key="error-msg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-600 font-semibold bg-red-50 py-2.5 px-4 rounded-lg border border-red-100 flex items-center gap-2 justify-center mb-4"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="relative">
                {/* أنيميشن الاهتزاز (Shake) عند وجود خطأ */}
                <motion.div
                  animate={errorMessage ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    disabled={loading}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className={`w-full h-[60px] bg-[#F5F6F7] rounded-xl text-center text-3xl font-bold tracking-[10px] focus:bg-white transition-all outline-none 
                      ${errorMessage ? 'border-2 border-red-500 bg-red-50' : (otp.length > 0 ? 'border-2 border-[#1877F2]' : 'border border-[#dddfe2]')}`}
                    placeholder="------"
                    autoFocus
                  />
                </motion.div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full h-[48px] bg-[#1877F2] hover:bg-[#166fe5] text-white text-[17px] font-bold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-lg shadow-[#1877F2]/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "تأكيد الحساب"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#dadde1]">
              <button 
                type="button"
                className="text-[#1877F2] text-sm font-semibold hover:underline"
                onClick={() => setErrorMessage("سيتم إعادة إرسال الرمز قريباً (هذه ميزة تجريبية)")}
              >
                إرسال الرمز مرة أخرى؟
              </button>
              <div className="mt-4">
                <Link to="/signup" className="text-sm text-[#606770] hover:underline">
                  تغيير البريد الإلكتروني
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* واجهة النجاح (Success Animation) - لم تتغير */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-white p-12 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] text-center max-w-[400px]"
          >
            <div className="w-24 h-24 bg-green-50 flex items-center justify-center rounded-full mb-6">
              <motion.svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                stroke="#00A884"
                strokeWidth="3"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6L9 17l-5-5"
                />
              </motion.svg>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800"
            >
              تم تفعيل حسابك!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#606770] mt-3"
            >
              شكراً لك على تأكيد هويتك. <br/> يتم تحويلك الآن لتسجيل الدخول...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}