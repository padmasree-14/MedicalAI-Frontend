import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 text-center font-sans">
      <div className="flex flex-col items-center gap-4 max-w-sm">
        
        {/* Visual Brand */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
          <Activity size={24} />
        </div>
        
        <h2 className="font-outfit text-4xl font-extrabold text-slate-900 tracking-tight">404</h2>
        <h3 className="font-outfit text-base font-bold text-slate-700">Page Not Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The diagnostic view or clinical resource you are searching for does not exist or has been archived.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-semibold text-white hover:bg-primary-dark transition-all shadow-sm"
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
export default NotFoundPage;
