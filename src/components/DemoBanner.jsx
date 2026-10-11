import { isDemoMode, exitDemo } from '../demo/demoMode';

// Shown on every page while demo mode is active, so it is always clear that
// the data is sample data and not coming from the real backend.
export default function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[900] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-3 rounded-full bg-slate-900/95 px-5 py-2.5 text-xs text-white shadow-xl backdrop-blur"
      role="status"
    >
      <span>
        <span className="mr-2 rounded-full bg-amber-400 px-2 py-0.5 font-bold uppercase tracking-wide text-slate-900">Demo</span>
        Sample data only. Nothing is sent to a server.
      </span>
      <button
        type="button"
        onClick={exitDemo}
        className="shrink-0 rounded-full bg-white/15 px-3 py-1 font-semibold hover:bg-white/25"
      >
        Exit demo
      </button>
    </div>
  );
}
