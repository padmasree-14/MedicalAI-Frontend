import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowRight, Brain, UserCheck } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-800">
      {/* Top Navbar */}
      <nav className="flex h-20 w-full items-center justify-between border-b border-slate-50 px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity size={22} />
          </div>
          <span className="font-outfit text-lg font-bold tracking-tight text-slate-900">Advanced Diagnostics</span>
        </Link>
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Clinician Log In
        </button>
      </nav>

      {/* Main Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-left flex flex-col gap-12">
        
        {/* Title */}
        <div className="flex flex-col gap-3">
          <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Mission & Diagnostics Philosophy</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Pioneering readable deep learning systems to bridge the gap between machine intelligence predictions and clinical validation.
          </p>
        </div>

        {/* Philosophy grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
            <h3 className="font-outfit text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Brain className="text-primary" size={16} />
              <span>Decoupling the Black Box</span>
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Modern neural networks excel at feature classification but fail at clinical transparency. Our core philosophy mandates that every diagnosis classification is visually localized (via Grad-CAM gradients) and textually justified (via medical large language models), giving physicians concrete, visual indicators to inspect.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
            <h3 className="font-outfit text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="text-primary" size={16} />
              <span>Clinical Decision Support</span>
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-500">
              The platform is built as an interactive decision support tool rather than an autonomous decision maker. By aggregating historical predictions, generating instant pdf drafts for print, and plotting classifier thresholds, we reduce administrative workload for busy pulmonary centers.
            </p>
          </div>
        </div>

        {/* Organization Story */}
        <div className="flex flex-col gap-4 border-t border-slate-150 pt-8">
          <h2 className="font-outfit text-lg font-bold text-slate-900">Platform Development</h2>
          <p className="text-xs leading-relaxed text-slate-500">
            This platform represents a complete end-to-end integration designed for diagnostic centers. Built in Node, React, and Python FastAPI, it maintains structural resilience via SQLite local fallbacks and features highly concurrent asynchronous database queries using Motor. The neural models are custom-compiled, utilizing convolutional features optimized for high recall.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 mt-4 border-t border-slate-150 pt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
          >
            <span>Return to Landing Page</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
