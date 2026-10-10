import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const LeftSidebar = ({ user }) => {
  const location = useLocation();

  // تم اختصار القائمة لتشمل فقط الأقسام الجوهرية للمنصة
  const menuItems = [
    { name: 'Dashboard', icon: 'fa-grid-2', path: '/home' },
    { name: 'Job Board', icon: 'fa-briefcase', path: '/jobs' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[280px]">
      {/* User Identity Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/40 shadow-xl shadow-slate-200/50">
        <div className="h-24 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>
        
        <div className="px-6 pb-8 flex flex-col items-center -mt-12 relative z-10">
          <div className="relative group">
            <motion.img
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-24 h-24 rounded-[2.2rem] object-cover border-4 border-white shadow-2xl transition-all"
              src={user?.profileImageUrl || '/Abood.png'}
              alt="Profile"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></span>
          </div>
          
          <div className="text-center mt-4">
            <h3 className="font-black text-slate-900 tracking-tight leading-tight">
              {user?.fullName || "User Name"}
            </h3>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">
              {user?.targetTitle || ''}
            </p>
          </div>


        </div>

        {/* Quick Stats Block - بيانات الداشبورد المباشرة */}
        <div className="grid grid-cols-2 border-t border-slate-50">
          <div className="p-4 text-center border-r border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Views</p>
            <p className="text-sm font-black text-slate-900">{user?.views || 0}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rank</p>
            <p className="text-sm font-black text-slate-900">{user?.rank || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - النسخة المختصرة */}
      <nav className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-3 border border-white/40 shadow-sm">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.8rem] transition-all duration-300 relative overflow-hidden group
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-slate-900 z-0"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                
                <i className={`fa-solid ${item.icon} text-sm relative z-10 transition-transform group-hover:scale-110 
                  ${isActive ? 'text-blue-400' : 'text-slate-400'}`}></i>
                <span className="text-[11px] font-black uppercase tracking-widest relative z-10">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Action Card - توليد السيرة الذاتية الذكية */}
      <button className="group bg-indigo-50 border border-indigo-100 rounded-[2rem] p-5 flex items-center justify-between hover:bg-indigo-600 transition-all duration-500">
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black text-indigo-400 uppercase group-hover:text-indigo-200">Personal Branding</span>
         </div>
        <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:rotate-12 transition-transform">
          <i className="fa-solid fa-file-pdf"></i>
        </div>
      </button>
    </div>
  );
};

export default LeftSidebar;