import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useUser();
  const location = useLocation();

  // 1. مصفوفة الروابط: سهولة في التعديل والإضافة
  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/home", icon: "fa-house", private: true },
      { name: "Jobs", path: "/jobs", icon: "fa-briefcase", private: true },
      {
        name: "Applications",
        path: "/applications",
        icon: "fa-user-tie",
        private: true,
      },
      {
        name: "Saved Jobs",
        path: "/saved",
        icon: "fa-bookmark",
        private: true,
      },
    ],
    [],
  );

  const handleLogout = () => {
    setMobileOpen(false);
    logout(); // clears the whole session and does a clean redirect to /login
  };

  // مكوّن فرعي للروابط لتقليل تكرار الكود
  const NavItem = ({ link }) => {
    const isActive = location.pathname === link.path;
    return (
      <Link
        to={link.path}
        className={`flex flex-col items-center gap-1 text-lg transition-colors ${
          isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-800"
        }`}
      >
        <i className={`fa-solid ${link.icon}`}></i>
        <p
          className={`text-xs font-bold ${isActive ? "text-blue-600" : "text-indigo-950"}`}
        >
          {link.name}
        </p>
      </Link>
    );
  };

  return (
    <>
      <nav className="z-50 flex items-center justify-between py-4 px-6 md:px-16 lg:px-24 xl:px-32 bg-white text-blue-800 fixed top-0 w-full shadow-sm border-b border-gray-100">
        {/* Logo */}
        <Link to="/" className="shrink-0 hover:opacity-90 transition">
          <img src="/5.png" alt="Doroop Logo" className="w-20" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {!loading &&
            navLinks.map(
              (link) =>
                (!link.private || user) && (
                  <NavItem key={link.path} link={link} />
                ),
            )}
        </div>

        {/* Right Section: Auth & Profile */}
        <div className="hidden md:flex items-center gap-5">
          {loading ? (
            <div className="flex gap-3">
              <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={user?.profileImageUrl || "/Abood.png"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-600 transition-all"
                    alt="Profile"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="font-bold text-indigo-950 group-hover:text-blue-600 transition">
                  {user?.fName}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                title="تسجيل الخروج"
              >
                <i className="fa-solid fa-arrow-right-from-bracket group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2 border border-blue-800 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-blue-800 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu - Enhanced UX */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 transform ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 flex flex-col h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end p-2 hover:bg-gray-100 rounded-full transition"
            >
              <i className="fa-solid fa-xmark text-xl text-gray-500"></i>
            </button>

            {user && (
              <div className="mt-4 mb-8 p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
                <img
                  src={user?.profileImageUrl || "/Abood.png"}
                  className="w-12 h-12 rounded-full border-2 border-white"
                  alt=""
                />
                <div className="overflow-hidden">
                  <p className="font-bold text-indigo-950 truncate">
                    {user?.fName} {user?.lName}
                  </p>
                  <p className="text-xs text-indigo-500">View Profile</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
              {navLinks.map(
                (link) =>
                  (!link.private || user) && (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50 transition-colors font-semibold"
                    >
                      <i
                        className={`fa-solid ${link.icon} w-6 text-blue-800`}
                      ></i>
                      {link.name}
                    </Link>
                  ),
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition"
                >
                  <i className="fa-solid fa-power-off w-6"></i> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full block text-center py-3 bg-blue-800 text-white rounded-xl font-bold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
