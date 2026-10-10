import { toast } from '../utils/toast';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ForgotPassword as forgotPasswordApi} from '../Api/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { setUserEmail } = useAuth();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await forgotPasswordApi(email); 
        if (response.status === 200 || response.status === 201) {
            setUserEmail(email); 
            navigate('/password-verification');
        }
    } catch (error) {
        console.error("Error details:", error);
        toast.error("حدث خطأ: " + (error?.message || "تأكد من البريد الإلكتروني"));
    }
};
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
          <p className="mt-3 text-sm text-gray-500 px-2">
            No worries! Enter your email address and we'll send you a 6-digit code to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. CompanyName@gmail.com"
              className="w-full h-14 px-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg">
            Send Reset Code
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
      <footer className="py-6 text-gray-400 text-xs">© 2026 Doroop. All rights reserved.</footer>
    </main>
  );
}