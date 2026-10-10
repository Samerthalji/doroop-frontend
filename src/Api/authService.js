import api from './apiClient';

// ===================== تسجيل الدخول =====================
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    if (response.data && response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refresh', response.data.refreshToken);
    }

    return response;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// ===================== إنشاء حساب =====================
// NOTE: "Regester" is the exact (misspelled) route exposed by the backend.
export const Register = async (credentials) => api.post('/auth/Regester', credentials);

// ===================== تأكيد الإيميل =====================
export const VerifyEmail = async (credentials) => {
  try {
    return await api.post('/auth/verify-email', credentials);
  } catch (error) {
    throw error.response ? error.response.data : new Error('Email verification failed');
  }
};

// ===================== نسيت كلمة السر =====================
export const ForgotPassword = async (credentials) => {
  try {
    return await api.post('/auth/forgot-password', credentials);
  } catch (error) {
    throw error.response ? error.response.data : new Error('Forgot password failed');
  }
};

// ===================== التحقق من كود إعادة التعيين =====================
export const VerifyResetCode = async (credentials) => {
  try {
    return await api.post('/auth/verify-reset-code', credentials);
  } catch (error) {
    throw error.response ? error.response.data : new Error('Code verification failed');
  }
};

// ===================== إعادة تعيين كلمة السر (بالكود) =====================
export const ResetPasswordFinal = async (credentials) => {
  try {
    return await api.post('/auth/reset-password-final', credentials);
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password reset failed');
  }
};

// ===================== تحديث كلمة السر (من البروفايل) =====================
export const UpdatePassword = async (credentials) => {
  try {
    return await api.post('/auth/update-password', credentials);
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password update failed');
  }
};
