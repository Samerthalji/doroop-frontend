import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useJobs } from '../context/JobContext';
import { getMyApplications } from '../Api/applicationService';

// ─── Variant: Home ── Application Status + Profile Power ──────────────────────
const HomePanel = ({ user }) => {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications(1, 50)
      .then(res => {
        const apps = res.data?.applications || res.data?.items || res.data || [];
        if (Array.isArray(apps)) {
          setStats({
            pending:  apps.filter(a => a.status === 'Pending').length,
            accepted: apps.filter(a => a.status === 'Accepted').length,
            rejected: apps.filter(a => a.status === 'Rejected').length,
            total:    apps.length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const checks = [
    { label: 'Target Role',   done: !!user?.targetTitle && user.targetTitle !== 'Not Set' },
    { label: 'Skills Added',  done: (user?.skills?.length || 0) > 0 },
    { label: 'AI Analysis',   done: !!user?.aiRecommendation },
    { label: 'Profile Photo', done: !!user?.profileImageUrl },
  ];
  const completionPct = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  const statusRows = [
    { label: 'Pending',  value: stats.pending,  bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-600',   iconBg: 'bg-amber-100',   icon: 'fa-clock' },
    { label: 'Accepted', value: stats.accepted, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100', icon: 'fa-check' },
    { label: 'Rejected', value: stats.rejected, bg: 'bg-rose-50',    border: 'border-rose-100',    text: 'text-rose-600',    iconBg: 'bg-rose-100',    icon: 'fa-xmark' },
  ];

  return (
    <>
      {/* Card 1: Career Status */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-blue-900/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Career Status</h3>
          <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-slate-300' : 'bg-emerald-500'}`} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : stats.total === 0 ? (
          <div className="text-center py-6">
            <i className="fa-solid fa-briefcase text-2xl text-slate-200 mb-3 block" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {statusRows.map((row, i) => (
              <motion.div key={i} whileHover={{ x: 4 }}
                className={`flex items-center justify-between p-3 rounded-2xl ${row.bg} border ${row.border}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${row.iconBg} flex items-center justify-center`}>
                    <i className={`fa-solid ${row.icon} ${row.text} text-xs`} />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase">{row.label}</span>
                </div>
                <span className={`text-xl font-black ${row.text}`}>{row.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && stats.total > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Sent</span>
            <span className="text-[9px] font-black text-slate-900">{stats.total} Applications</span>
          </div>
        )}
      </div>

      {/* Card 2: Profile Power */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/20 blur-[50px]" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="font-black text-sm">Profile Power</h3>
          <span className="text-2xl font-black text-indigo-400">{completionPct}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-5 relative z-10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-1.5 bg-indigo-500 rounded-full" />
        </div>
        <div className="space-y-2.5 relative z-10">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-md flex items-center justify-center ${c.done ? 'bg-indigo-500' : 'border border-white/20'}`}>
                {c.done && <i className="fa-solid fa-check text-[8px]" />}
              </div>
              <span className={`text-[10px] font-bold ${c.done ? 'text-white/40 line-through' : 'text-white'}`}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── Variant: Jobs ── Your Skills Snapshot ────────────────────────────────────
const JobsPanel = ({ user }) => {
  const skills = user?.skills || [];

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-blue-900/5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Your Skills</h3>
        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
          {skills.length} Total
        </span>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-6">
          <i className="fa-solid fa-layer-group text-2xl text-slate-200 mb-3 block" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add skills to your profile</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 9).map((s, i) => {
            const name = typeof s === 'string' ? s : (s?.skillName || s?.name || '');
            return (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-tight hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all cursor-default">
                {name}
              </motion.span>
            );
          })}
          {skills.length > 9 && (
            <span className="px-3 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white">
              +{skills.length - 9}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Jobs shown are matched to these skills
        </p>
      </div>
    </div>
  );
};

// ─── Variant: Applications ── Analytics ───────────────────────────────────────
const ApplicationsPanel = () => {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications(1, 50)
      .then(res => {
        const apps = res.data?.applications || res.data?.items || res.data || [];
        if (Array.isArray(apps)) {
          setStats({
            pending:  apps.filter(a => a.status === 'Pending').length,
            accepted: apps.filter(a => a.status === 'Accepted').length,
            rejected: apps.filter(a => a.status === 'Rejected').length,
            total:    apps.length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const successRate  = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;
  const responseRate = stats.total > 0 ? Math.round(((stats.accepted + stats.rejected) / stats.total) * 100) : 0;

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-blue-900/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Analytics</h3>
          <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-slate-300' : 'bg-emerald-500'}`} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Success Rate Bar */}
            {[
              { label: 'Success Rate',  value: successRate,  color: 'text-emerald-600', trackBg: 'bg-emerald-100', barBg: 'bg-emerald-500', cardBg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Response Rate', value: responseRate, color: 'text-indigo-600',  trackBg: 'bg-indigo-100',  barBg: 'bg-indigo-500',  cardBg: 'bg-indigo-50',  border: 'border-indigo-100' },
            ].map((r, i) => (
              <div key={i} className={`p-4 ${r.cardBg} border ${r.border} rounded-2xl`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-600 uppercase">{r.label}</span>
                  <span className={`text-lg font-black ${r.color}`}>{r.value}%</span>
                </div>
                <div className={`w-full ${r.trackBg} rounded-full h-1.5`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.value}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-1.5 ${r.barBg} rounded-full`} />
                </div>
              </div>
            ))}

            {/* Count Boxes */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: 'Pending',  value: stats.pending,  color: 'text-amber-600',   bg: 'bg-amber-50' },
                { label: 'Accepted', value: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Rejected', value: stats.rejected, color: 'text-rose-600',    bg: 'bg-rose-50' },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-2xl p-3 text-center`}>
                  <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Total Applied Card */}
      {!loading && (
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-[50px]" />
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 relative z-10">Total Applied</p>
          <div className="text-5xl font-black text-white relative z-10">{stats.total}</div>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-2 relative z-10">
            Applications tracked by Doroob AI
          </p>
        </div>
      )}
    </>
  );
};

// ─── Variant: Saved ── Vault Breakdown ────────────────────────────────────────
const SavedPanel = () => {
  const { savedJobs } = useJobs();

  const typeBreakdown = savedJobs.reduce((acc, job) => {
    const raw  = job.type || job.jobType || 'Other';
    const type = raw.replace(/([A-Z])/g, ' $1').trim();
    acc[type]  = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(typeBreakdown);
  const palette = [
    { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600',  bar: 'bg-indigo-500' },
    { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    { bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-600',   bar: 'bg-amber-500' },
    { bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-600',    bar: 'bg-rose-500' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-blue-900/5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Vault Breakdown</h3>
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-6">
          <i className="fa-regular fa-bookmark text-2xl text-slate-200 mb-3 block" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No saved jobs yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(([type, count], i) => {
            const pct = Math.round((count / savedJobs.length) * 100);
            const c   = palette[i % palette.length];
            return (
              <motion.div key={type}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-2xl ${c.bg} border ${c.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black ${c.text} uppercase`}>{type}</span>
                  <span className={`text-[10px] font-black ${c.text}`}>{count} job{count > 1 ? 's' : ''}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-1 ${c.bar} rounded-full`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Saved</span>
        <span className="text-[9px] font-black text-slate-900">{savedJobs.length} Positions</span>
      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
const RightPanel = ({ variant = 'home' }) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-6 w-full max-w-[320px]">
      {variant === 'home'         && <HomePanel user={user} />}
      {variant === 'jobs'         && <JobsPanel user={user} />}
      {variant === 'applications' && <ApplicationsPanel />}
      {variant === 'saved'        && <SavedPanel />}
    </div>
  );
};

export default RightPanel;