import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  UploadCloud, 
  Brain, 
  ChevronDown, 
  CheckCircle2, 
  Mail, 
  Building,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submittedContact, setSubmittedContact] = useState(false);

  const faqs = [
    {
      q: "What is Grad-CAM and how does it assist clinicians?",
      a: "Grad-CAM (Gradient-weighted Class Activation Mapping) is an explainable AI technology that highlights the exact spatial features (lung regions) our neural network focuses on to compute classification scores. This assists radiographers by visually indicating anomalies."
    },
    {
      q: "What is the validation accuracy of the deep learning model?",
      a: "The underlying 3-layer convolutional network achieves a diagnostic accuracy above 94% on chest radiography datasets, matching industry standards for screening assistance."
    },
    {
      q: "How are the LLM clinical reports generated?",
      a: "Following image classification, the prediction label and probability values are parsed into an advanced clinical knowledge model (Gemini API) which compiles a structured report outlining clinical explanation, differential causes, and care suggestions."
    },
    {
      q: "Does the system support offline fallback database engines?",
      a: "Yes. To ensure extreme reliability, the platform operates a hybrid database strategy. If connections to the cloud MongoDB Atlas timeout, the server automatically defaults to local SQLite storage."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedContact(true);
    setTimeout(() => setSubmittedContact(false), 5000);
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans selection:bg-primary selection:text-white">
      {/* Landing Navbar */}
      <nav className="flex h-20 w-full items-center justify-between border-b border-slate-50 px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity size={22} />
          </div>
          <div>
            <span className="font-outfit text-lg font-bold tracking-tight text-slate-900">Advanced Diagnostics</span>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Intelligence Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="hidden md:inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-sm shadow-primary/10"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-12 md:py-28 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 text-left">
          <div className="inline-flex max-w-max items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Brain size={14} />
            <span>Clinical-Grade Screening Assistance</span>
          </div>
          <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            AI-Driven Pulmonary <br />
            <span className="text-primary">Image Diagnostics</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-lg">
            Empower your clinical workspace with instant Deep Learning screening, visual Grad-CAM localization, and automatically compiled diagnostic reports.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/15"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </button>
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Clinician Dashboard
            </Link>
          </div>
        </div>

        {/* Diagnostic Simulator illustration */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl -z-10 blur-xl"></div>
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                <span className="text-xs font-bold text-slate-700">Scan Simulation ID: DL-8894</span>
              </div>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600">PNEUMONIA</span>
            </div>
            
            {/* Visual scan representation */}
            <div className="relative aspect-video rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {/* Fake X-Ray graphic elements */}
              <div className="absolute inset-0 flex justify-between px-16 py-6 opacity-30">
                <div className="h-full w-12 rounded-full border border-slate-400"></div>
                <div className="h-full w-12 rounded-full border border-slate-400"></div>
              </div>
              {/* Highlight area */}
              <div className="absolute h-10 w-10 rounded-full bg-rose-400/40 border border-rose-500 animate-pulse blur-sm" style={{ top: '40%', left: '30%' }}></div>
              <div className="absolute h-8 w-8 rounded-full bg-rose-400/40 border border-rose-500 animate-pulse blur-sm" style={{ top: '50%', left: '60%' }}></div>
              <Activity className="text-slate-300 animate-pulse" size={40} />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Confidence Index</span>
                <span>94.8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '94.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="bg-slate-50/50 border-y border-slate-50 px-6 py-20 md:px-12">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-4 mb-16">
          <h2 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">Full-Stack Medical Diagnostics</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Everything your medical imaging clinic needs to store, classify, explain, and document scans in one unified interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain size={22} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">Deep Learning Inference</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Integrated Convolutional Neural Network (CNN) classifies chest radiographies into NORMAL or PNEUMONIA classes within milliseconds of upload.
            </p>
          </div>
          {/* Card 2 */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Activity size={22} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">Grad-CAM Interpretability</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Visualizes features that influenced prediction scores. The gradient-weighted activation mapping outputs clear region-of-interest heatmaps.
            </p>
          </div>
          {/* Card 3 */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UploadCloud size={22} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-slate-900 mb-2">Clinical Report Builder</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Generative clinical descriptions compiled by Large Language Models are formatted as formal diagnostic reports, downloadable instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="px-6 py-20 md:px-12 max-w-7xl mx-auto">
        <div className="text-center flex flex-col gap-4 mb-16">
          <h2 className="font-outfit text-3xl font-extrabold text-slate-900 tracking-tight">How the Platform Works</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Streamlining diagnostic assistance into three secure, automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white font-bold text-lg shadow-md shadow-primary/10">1</div>
            <h3 className="font-outfit text-base font-bold text-slate-900 mt-4 mb-2">Upload Radiography</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Drop radiography images directly into the secure clinic dashboard. The app supports PNG, JPG, and BMP formats.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white font-bold text-lg shadow-md shadow-primary/10">2</div>
            <h3 className="font-outfit text-base font-bold text-slate-900 mt-4 mb-2">Automated Execution</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Our backend runs CNN class inference, generates Grad-CAM heatmaps, and queries the clinical report model simultaneously.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white font-bold text-lg shadow-md shadow-primary/10">3</div>
            <h3 className="font-outfit text-base font-bold text-slate-900 mt-4 mb-2">Download Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Review diagnostic summaries, clinical explanations, differential causes, and download the print-ready PDF document.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Summary Section */}
      <section className="bg-slate-50 border-t border-slate-100 px-6 py-16 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-md">
            <h2 className="font-outfit text-2xl font-extrabold text-slate-900 mb-4 leading-tight">Built on Robust Architecture</h2>
            <p className="text-xs leading-relaxed text-slate-500">
              The platform utilizes FastAPI's high-speed asynchronous processing alongside Python deep learning environments. The database layer utilizes a fail-safe hybrid design (MongoDB Atlas + local SQLite fallback) to protect patient records.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['FastAPI Async', 'TensorFlow 2.x', 'React TypeScript', 'Tailwind CSS', 'MongoDB Atlas', 'SQLite Fail-Safe'].map((tech) => (
              <span key={tech} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-6 py-20 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-outfit text-center text-3xl font-extrabold text-slate-900 tracking-tight mb-12">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-slate-100 shadow-soft overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="flex w-full items-center justify-between bg-white px-6 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-outfit">{faq.q}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform duration-200 ${activeFaq === index ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-50/50"
                  >
                    <p className="px-6 pb-4 pt-2 text-xs leading-relaxed text-slate-500 border-t border-slate-50">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50/40 border-t border-slate-150 px-6 py-20 md:px-12">
        <div className="max-w-xl mx-auto rounded-2xl border border-slate-100 bg-white p-8 shadow-soft">
          <h2 className="font-outfit text-center text-2xl font-bold text-slate-900 mb-2">Request Platform Integration</h2>
          <p className="text-center text-xs text-slate-400 mb-8">Deploy Advanced Diagnostics in your imaging facility.</p>
          
          {submittedContact ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900">Request Submitted Successfully</h3>
              <p className="mt-2 text-xs text-slate-500">Our clinical solutions specialist will reach out within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Sarah Jenkins"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Clinic Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={14} />
                    <input
                      type="email"
                      required
                      placeholder="s.jenkins@clinic.org"
                      className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Institution Size</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-slate-400" size={14} />
                    <select
                      required
                      className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none bg-white transition-colors"
                    >
                      <option value="">Select size...</option>
                      <option value="small">1 - 5 Doctors</option>
                      <option value="medium">6 - 25 Doctors</option>
                      <option value="large">25+ Doctors</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Integration Message</label>
                <textarea
                  required
                  placeholder="Detail your local imaging systems (PACS/DICOM) and target deployment..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-primary focus:outline-none transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
              >
                Submit Integration Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
