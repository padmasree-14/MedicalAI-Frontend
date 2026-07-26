import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-6">
      {/* Brand logo & header details */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity size={22} />
        </div>
        <div>
          <h1 className="font-outfit text-base font-semibold text-slate-900">Advanced Diagnostics</h1>
          <p className="text-xs text-slate-400">AI Medical Intelligence</p>
        </div>
      </div>

      {/* Clinician / Clinic Metadata */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900">{user.username}</span>
            <span className="text-[10px] text-slate-400">{user.clinic_name || 'General Clinic'}</span>
          </div>
        )}
        
        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <User size={18} />
        </div>

        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-rose-600 transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
