import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  BarChart3, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/prediction', label: 'Run Prediction', icon: UploadCloud },
    { to: '/history', label: 'Patient History', icon: History },
    { to: '/analytics', label: 'Model Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Account Profile', icon: User },
  ];

  return (
    <aside className="flex h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-100 bg-white p-4 justify-between">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Action at Bottom */}
      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
      >
        <LogOut size={18} />
        <span>Logout Session</span>
      </button>
    </aside>
  );
};
