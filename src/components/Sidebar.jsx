import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const { user, logout } = useUser();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive(path)
        ? 'bg-blue-800 text-white font-bold'
        : 'text-indigo-950 hover:bg-blue-50 hover:text-blue-800'
    }`;

  return (
    <div className="col-span-3 hidden lg:block bg-gray-100 w-full sticky top-20 h-fit">
      {/* Profile Card */}
      <div className="flex flex-col justify-center items-center mx-auto my-2 w-full p-5 bg-white rounded-lg shadow-lg border border-gray-100 shadow-gray-500">
        <Link to="/profile">
          <img src={user?.profileImageUrl || '/Abood.png'} alt="profile" className="w-16 h-16 rounded-full object-cover" />
        </Link>
        <h1 className="text-xl font-extrabold mt-2">{user?.fName} {user?.lName}</h1>
        <p className="text-gray-600 text-sm text-center">{user?.headline}</p>
        <Link to="/profile"
          className="bg-white rounded-full text-blue-800 text-center border-2 border-blue-800 w-full p-1 my-2 hover:bg-blue-800 hover:text-white hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold">
          View Profile
        </Link>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-1 mx-auto my-5 w-full p-3 bg-white rounded-lg border border-gray-100 shadow-lg shadow-gray-500">
        <Link to="/home" className={linkClass('/home')}>
          <i className="fa-solid fa-house w-5 text-center"></i>
          <span>Home</span>
        </Link>
        <Link to="/jobs" className={linkClass('/jobs')}>
          <i className="fa-solid fa-briefcase w-5 text-center"></i>
          <span>Jobs</span>
        </Link>
        <Link to="/applications" className={linkClass('/applications')}>
          <i className="fa-solid fa-user-tie w-5 text-center"></i>
          <span>My Applications</span>
        </Link>
        <Link to="/saved" className={linkClass('/saved')}>
          <i className="fa-solid fa-bookmark w-5 text-center"></i>
          <span>Saved Jobs</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
          <span>Logout</span>
        </button>
      </div>

      <Link to="/create-company"
        className="flex items-center justify-center px-5 py-3 mt-4 text-blue-800 bg-white font-semibold border-2 border-blue-800 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:text-white hover:shadow-md w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Create Company</span>
      </Link>
    </div>
  );
}
