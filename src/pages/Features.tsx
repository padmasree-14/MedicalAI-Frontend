import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const featureList = [
    {
      title: "Convolutional Neural Network (CNN)",
      desc: "Trained using a custom 3-layer Convolutional stack with batch normalization, achieving validation accuracy above 94% on radiography inputs."
    },
    {
      title: "Visual Feature Activations (Grad-CAM)",
      desc: "Applies gradient-weighted class activation mapping to extract activation weights from the final conv layer. Generates overlay heatmaps showing region of focus."
    },
    {
      title: "Generative Diagnosis Reports",
      desc: "Integrates with Google Gemini API to compile clinical descriptions, differential causes, and care instructions based on predicted scores."
    },
    {
      title: "Fail-Safe Database Layer",
      desc: "Maintains real-time logs and prediction histories in MongoDB Atlas, with an automated thread-safe local SQLite fallback engine."
    },
    {
      title: "PDF Document Compiler",
      desc: "Compiles formatted PDF documents using ReportLab, containing metadata tables, side-by-side scans, and diagnostics paragraphs."
    },
    {
      title: "Secure JWT Authentication",
      desc: "Protects patient entries via secure JWT credentials, bcrypt password hashing, and token validation guards on frontend navigation routing."
    }
  ];

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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-left flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Platform Capabilities</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            A comprehensive overview of our deep learning diagnostic pipelines, visual explainability layers, and server architectures.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {featureList.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-outfit">
                <CheckCircle2 size={16} className="text-primary" />
                <span>{f.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 pl-6">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Bottom */}
        <div className="flex items-center gap-4 mt-4 border-t border-slate-150 pt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
          >
            <span>Return to Home</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </main>
    </div>
  );
};
