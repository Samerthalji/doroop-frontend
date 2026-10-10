import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { subscribe } from '../utils/toast';

const STYLES = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-slate-800',
};

const DURATION_MS = 4000;

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = new Set();
    const unsubscribe = subscribe((item) => {
      setToasts((prev) => [...prev, item]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
        timers.delete(timer);
      }, DURATION_MS);
      timers.add(timer);
    });
    return () => {
      unsubscribe();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-2 px-4 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className={`${STYLES[t.type] || STYLES.info} pointer-events-auto max-w-md rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
