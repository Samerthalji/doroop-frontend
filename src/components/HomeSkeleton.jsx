import React from 'react';

const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`}></div>
);

const HomeSkeleton = () => {
  return (
    <div className="bg-[#F8F9FD] min-h-screen pt-24 pb-12">
      <div className="max-w-[1350px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* العمود الأيسر - Sidebar Skeleton */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col items-center">
              <SkeletonPulse className="w-20 h-20 rounded-3xl mb-4" />
              <SkeletonPulse className="w-32 h-4 mb-2" />
              <SkeletonPulse className="w-24 h-3 mb-6" />
              <SkeletonPulse className="w-full h-12 rounded-2xl" />
            </div>
            <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonPulse key={i} className="w-full h-12 rounded-2xl" />
              ))}
            </div>
          </aside>

          {/* العمود الأوسط - Feed Skeleton */}
          <div className="col-span-12 lg:col-span-6 space-y-8">
            {/* بار إنشاء البوست */}
            <div className="bg-white border border-slate-100 p-4 rounded-[2.5rem] flex items-center gap-4">
              <SkeletonPulse className="w-12 h-12 rounded-2xl" />
              <SkeletonPulse className="flex-1 h-12 rounded-2xl" />
              <SkeletonPulse className="w-12 h-12 rounded-2xl" />
            </div>

            {/* بوستات وهمية */}
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[3rem] p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <SkeletonPulse className="w-14 h-14 rounded-2xl" />
                  <div className="space-y-2">
                    <SkeletonPulse className="w-32 h-4" />
                    <SkeletonPulse className="w-20 h-3" />
                  </div>
                </div>
                <div className="space-y-3">
                  <SkeletonPulse className="w-full h-4" />
                  <SkeletonPulse className="w-[90%] h-4" />
                </div>
                <SkeletonPulse className="w-full h-64 rounded-[2.5rem]" />
                <div className="flex gap-4 pt-4">
                  <SkeletonPulse className="w-24 h-10 rounded-2xl" />
                  <SkeletonPulse className="w-24 h-10 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>

          {/* العمود الأيمن - Right Panel Skeleton */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-7 border border-slate-100 space-y-6">
              <SkeletonPulse className="w-24 h-3 mb-4" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonPulse className="w-12 h-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <SkeletonPulse className="w-24 h-3" />
                    <SkeletonPulse className="w-16 h-2" />
                  </div>
                  <SkeletonPulse className="w-9 h-9 rounded-xl" />
                </div>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;