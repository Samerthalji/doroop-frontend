import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VerifyResetCode } from '../Api/authService';

export default function PasswordVerification() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userEmail, setResetCode } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await VerifyResetCode({ email: userEmail, code });
      if (response.status === 200 || response.status === 201) {
        setResetCode(code);
        navigate('/reset-password');
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Check Your Email</h2>
          <p className="mt-3 text-sm text-gray-500">
            We've sent a 6-digit reset code to <strong>{userEmail}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text" 
              maxLength="6"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="000000"
              className="w-full h-16 text-center text-3xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all tracking-[1.2rem] font-mono pl-[1.2rem]"
            />
            <div className="mt-2 text-center text-xs text-gray-400 italic">Enter the code from your email</div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-600 bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Continue to Reset'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn't get the code? 
            <button className="font-bold text-indigo-600 hover:text-indigo-500 ml-1">Resend Code</button>
          </p>
        </div>
      </div>
    </main>
  );
}