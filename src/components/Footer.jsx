import React from 'react';

export default function Footer() {
  return (
    <footer className="flex flex-col bg-white border-2 border-gray-500 items-center justify-around w-full py-12 text-sm text-gray-800/70">
      <div className="flex items-center gap-8">
        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">Home</a>
        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">About</a>
        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">Services</a>
        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">Contact</a>
        <a href="#" className="font-medium text-gray-500 hover:text-black transition-all">Help</a>
      </div>
      <div className="flex items-center gap-4 mt-8">
        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300"><i className="fa-brands fa-facebook text-3xl text-indigo-800"></i></a>
        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300"><i className="fa-brands fa-square-instagram text-3xl text-pink-600"></i></a>
        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300"><i className="fa-brands fa-linkedin text-3xl text-blue-500"></i></a>
        <a href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-black"><i className="fa-brands fa-github text-3xl"></i></a>
      </div>
      <p className="mt-8 text-center">Copyright © 2026 <a href="#"> Doroop</a>. All rights reserved.</p>
    </footer>
  );
}
