import { FaBars, FaBell } from "react-icons/fa";

function Navbar({ onMenuClick }) {
  return (
    <header className="mb-6 rounded-lg border border-white/20 bg-white/50 p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150 sticky top-0 z-10">
    <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <FaBars className="text-lg" />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              Welcome back 
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track, manage and understand your expenses smartly
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100">
            <FaBell className="text-base" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;