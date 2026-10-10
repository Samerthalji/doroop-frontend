import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// أضفنا props لاستلام بيانات الشركة والـ id
const CompanySidebar = ({ companyId, companyLogo, companyName }) => {
  const navigate = useNavigate();
  const { logout } = useUser();

  // تحديث المسارات لتشمل الـ id الديناميكي
  const menuItems = [
    { name: 'Overview', path: `/company-dashboard/${companyId}`, icon: 'fa-chart-pie' },
    { name: 'My Jobs', path: `/company-jobs/${companyId}`, icon: 'fa-briefcase' },
    // Settings is hidden until the page is connected to the API (see README, Known limitations).
  ];

  const handleLogout = () => {
    logout(); // clears the whole session and does a clean redirect to /login
  };
 const handleBackToProfile = () => {
    navigate('/profile');
  };
  return (
    <div className="w-72 bg-slate-900 min-h-screen p-6 flex flex-col sticky top-0 h-screen shadow-2xl">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <img src="/5.png" alt="Logo" className="w-6 h-6 object-contain invert" />
        </div>
        <span className="text-white font-black uppercase italic tracking-tighter text-xl">
          Doroop <span className="text-indigo-500 text-xs not-italic font-bold ml-1 tracking-widest">BIZ</span>
        </span>
      </div>
   <button
        onClick={handleBackToProfile}
        className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-slate-300 hover:bg-slate-800 hover:text-white transition-all mb-6"
      >
        <i className="fa-solid fa-arrow-left text-lg"></i>
        Back To Profile
      </button>
      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4 mb-6">Main Menu</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest transition-all group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} text-lg transition-transform group-hover:scale-110`}></i>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout & Profile Section */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all mb-4"
        >
          <i className="fa-solid fa-right-from-bracket text-lg text-rose-500"></i>
          Logout
        </button>

        {/* Quick User Info - تم ربطها بالبيانات الحقيقية */}
        <div className="bg-slate-800/50 p-4 rounded-[2rem] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center">
            {companyLogo ? (
              <img src={companyLogo} alt="Company" className="w-full h-full object-cover" />
            ) : (
              <span className="text-indigo-600 font-black text-xs">{companyName?.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="overflow-hidden text-ellipsis">
            <p className="text-white font-black text-[10px] uppercase truncate tracking-tighter">
              {companyName || "Company Admin"}
            </p>
            <p className="text-slate-500 font-bold text-[8px] uppercase tracking-widest truncate">Manage Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySidebar;