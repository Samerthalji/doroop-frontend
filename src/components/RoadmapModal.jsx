import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapModal({ data, userSkills, onClose }) {
  const [activeTab, setActiveTab] = useState('to-learn');
  // حالة المهارة المختارة لعرض مصادرها
  const [selectedSkill, setSelectedSkill] = useState(null);

  // استخراج أسماء المهارات التي يمتلكها المستخدم للمقارنة
  const masteredSkillNames = userSkills?.map(s => (s.skillName || s.name || "").toLowerCase()) || [];

  // تقسيم البيانات بناءً على المهارات المتعلمة والمهارات التي تحتاج تعلم
  const toLearnSkills = data.filter(item => !masteredSkillNames.includes((item.skillName || "").toLowerCase()));
  const masteredSkills = data.filter(item => masteredSkillNames.includes((item.skillName || "").toLowerCase()));

  // دالة لفتح المصادر
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md font-sans"
    >
      <div className="bg-white w-full max-w-5xl h-[85vh] overflow-hidden rounded-[3rem] flex flex-col relative shadow-2xl border border-white/20">
        
        {/* Header Section */}
        <div className="p-10 pb-6 border-b border-slate-50">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-all">
            <i className="fa-solid fa-circle-xmark text-3xl"></i>
          </button>
          
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">
            {selectedSkill ? `Sources: ${selectedSkill.skillName}` : 'Skill Navigator'}
          </h2>
          
          {!selectedSkill ? (
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveTab('to-learn')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'to-learn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                To Learn ({toLearnSkills.length})
              </button>
              <button 
                onClick={() => setActiveTab('mastered')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mastered' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Mastered ({masteredSkills.length})
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setSelectedSkill(null)}
              className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Skills
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 pt-8 bg-slate-50/30">
          <AnimatePresence mode="wait">
            {!selectedSkill ? (
              // 1. عرض قائمة المهارات
              <motion.div 
                key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {(activeTab === 'to-learn' ? toLearnSkills : masteredSkills).map((item, index) => (
                  <motion.div 
                    key={item.skillName}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSkillClick(item)}
                    className={`p-6 rounded-[2.5rem] border bg-white cursor-pointer group transition-all hover:shadow-xl ${activeTab === 'to-learn' ? 'hover:border-indigo-500' : 'hover:border-emerald-500'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors ${activeTab === 'to-learn' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                      <i className={`fa-solid ${activeTab === 'to-learn' ? 'fa-rocket' : 'fa-check-double'} text-lg`}></i>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tighter mb-2 uppercase italic leading-tight">{item.skillName}</h3>
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${activeTab === 'to-learn' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                      Explore Sources <i className="fa-solid fa-arrow-right-long ml-1 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // 2. عرض المصادر للمهارة المختارة (هنا التعديل الجوهري)
              <motion.div 
                key="sources" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {selectedSkill.topResources?.length > 0 ? (
                  selectedSkill.topResources.map((source, i) => (
                    <a 
                      key={i} href={source.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-500 hover:shadow-lg transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${source.url?.includes('youtube') ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        <i className={source.url?.includes('youtube') ? "fa-brands fa-youtube" : "fa-solid fa-link"}></i>
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="font-black text-slate-900 text-[13px] uppercase italic leading-tight">
                          {source.courseTitle || "Study Resource"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                             {source.instructor || "Expert"}
                           </span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <span className="text-indigo-500 text-[9px] font-black uppercase tracking-widest">
                             {source.platform}
                           </span>
                        </div>
                      </div>
                      <i className="fa-solid fa-external-link text-slate-200 group-hover:text-indigo-600 text-xs transition-colors"></i>
                    </a>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <i className="fa-solid fa-magnifying-glass text-4xl text-slate-200 mb-4"></i>
                    <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest">No specific sources found for this skill.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}