import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ProfilePage from './pages/ProfilePage';
import JobApplicationPage from './pages/JobApplicationPage';
import ReviewApplicationPage from './pages/ReviewApplicationPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import ForgotPassword from './pages/ForgotPassword';
import PasswordVerification from './pages/PasswordVerification';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSkeleton from './components/ProfileSkeleton';
import HomeSkeleton from './components/HomeSkeleton';
import CompanyDashboard from './pages/CompanyDashboard';
import MyJobs from './pages/MyJobs';
import ApplicantsPage from './pages/ApplicantsPage';
import CompanySettings from './pages/CompanySetting';
import Toaster from './components/Toaster';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/password-verification" element={<PasswordVerification />} />

<Route element={<ProtectedRoute loadingComponent={<ProfileSkeleton />} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
<Route element={<ProtectedRoute loadingComponent={<ProfileSkeleton />} />}>
 
 <Route path="/applicants/:companyId/:jobId" element={<ApplicantsPage />} />
  {/* أضف :id إلى نهاية المسار */}
  <Route path="/company-jobs/:id" element={<MyJobs />} />
<Route path="/settings/:companyId" element={<CompanySettings />} />
</Route>
<Route element={<ProtectedRoute loadingComponent={<HomeSkeleton />} />}>
        <Route path="/home" element={<HomePage />} />
        </Route>

        <Route element={<ProtectedRoute/>}>
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/saved" element={<SavedJobsPage />} />
         <Route path="/job/:id" element={<JobApplicationPage />} />
        <Route path="/review-application/:id" element={<ReviewApplicationPage />} />

        <Route path="/create-company" element={<CreateCompanyPage />} />
        <Route path="/company-dashboard/:id" element={<CompanyDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
