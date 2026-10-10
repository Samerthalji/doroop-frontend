const ProfileSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen pt-16 animate-pulse">
      <div className="grid grid-cols-1 gap-5 mx-5 md:grid-cols-12 my-5">
        
        {/* العمود الأساسي */}
        <div className="col-span-9 bg-white border rounded-md p-4 shadow-lg w-full">
          
          {/* الكفر (الغلاف) */}
          <div className="h-32 w-full bg-gray-200 rounded-2xl"></div>
          
          {/* الصورة الشخصية */}
          <div className="relative flex justify-center -mt-12">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>
          </div>

          {/* نصوص الاسم والوصف */}
          <div className="flex flex-col items-center mt-4 space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded-md"></div> {/* الاسم */}
            <div className="h-4 w-32 bg-gray-100 rounded-md"></div> {/* الوصف */}
          </div>

          {/* مربعات الإحصائيات (Posts, Friends) */}
          <div className="flex border-t border-gray-100 bg-gray-50 w-full mt-8">
            <div className="flex-1 h-14 bg-gray-200 m-2 rounded-lg"></div>
            <div className="flex-1 h-14 bg-gray-200 m-2 rounded-lg"></div>
          </div>

          {/* سطر معلومات التواصل */}
          <div className="mt-8 space-y-4 px-10">
            <div className="h-4 w-full bg-gray-100 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
          </div>
          
          {/* هيكل البوستات */}
          <div className="mt-10 space-y-6">
             {[1, 2].map(i => (
               <div key={i} className="max-w-lg mx-auto border border-gray-100 p-4 rounded-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-32 w-full bg-gray-100 rounded"></div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProfileSkeleton
; // هاي هي اللي بتسمح للملفات الثانية تشوفه