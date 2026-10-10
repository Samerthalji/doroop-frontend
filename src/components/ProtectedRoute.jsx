import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ loadingComponent }) => {
  const { user, loading } = useUser();  
  const token = localStorage.getItem('token');

  // طالما السيستم عم بعمل تحميل، بنعرض الـ Skeleton أو اللودر
  if (loading) {
    return loadingComponent || <div className="p-10 text-center">Loading Profile...</div>;
  }

  // ⚠️ التعديل الجوهري:
  // لو ما في مستخدم، وبنفس الوقت ما في توكن بالـ storage أصلاً، هون بس بنطلعه للـ login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // إذا التوكن موجود بس الـ user لسه ما شرف (بسبب الـ async)، بنخليه يستنى وما يعمل Navigate
  if (!user && token) {
    return loadingComponent || <div className="p-10 text-center">Loading Profile...</div>;
  }

  // إذا كل شيء تمام والمستخدم موجود، ادخل على الصفحة فوراً
  return <Outlet />;
};

export default ProtectedRoute;