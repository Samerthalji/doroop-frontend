import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, showUnsave, onSave, onUnsave, savedJobs }) {
  const navigate = useNavigate();
  const isSaved = savedJobs && savedJobs.includes(job.id);

  return (
    <div className="w-full border border-gray-200 p-4 rounded-xl mx-2 max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3 md:items-center justify-between w-full text-gray-500">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-1">
            <img src={job.logo || '/googleLogo.png'} alt="" className="w-14" />
          </div>
          <div>
            <h3 className="text-base font-bold text-indigo-950">{job.title}</h3>
            <span>{job.company}</span>
          </div>
        </div>
        <span>{job.date}</span>
      </div>

      {/* Info */}
      <div className="flex justify-around items-center pt-10">
        <div className="text-gray-600 flex justify-center items-center gap-2">
          <i className="fa-solid fa-dollar-sign"></i>
          <p>{job.salary}</p>
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-2">
          <i className="fa-solid fa-clock"></i>
          <p>{job.type}</p>
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-2">
          <i className="fa-solid fa-briefcase"></i>
          <p>{job.experience}</p>
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-2">
          <i className="fa-solid fa-location-dot"></i>
          <p>{job.location}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center w-full gap-3">
        {showUnsave ? (
          <button
            onClick={() => onUnsave && onUnsave(job.id)}
            className="bg-blue-800 rounded-lg text-white w-1/2 px-2 py-2 mt-4 hover:bg-indigo-900 duration-200">
            Unsave
          </button>
        ) : (
          <button
            onClick={() => onSave && onSave(job.id)}
            className={`rounded-lg text-white w-1/2 px-2 py-2 mt-4 duration-200 ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-800 hover:bg-indigo-900'}`}>
            {isSaved ? 'Saved ✓' : 'Save'}
          </button>
        )}
        <button
          onClick={() => navigate(`/job/${job.id}`)}
          className="bg-blue-800 rounded-lg text-white w-1/2 px-2 py-2 mt-4 hover:bg-indigo-900 duration-200">
          Show more
        </button>
      </div>
    </div>
  );
}
