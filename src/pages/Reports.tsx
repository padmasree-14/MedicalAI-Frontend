import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FileDown, 
  AlertCircle, 
  ChevronLeft,
  FileText,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const predictionId = searchParams.get('prediction_id');
  
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!predictionId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/predictions/${predictionId}/report`);
        setReport(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || "Could not retrieve clinical report. Ensure scan exists.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [api, predictionId]);

  const handleDownloadPDF = () => {
    if (!predictionId) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const url = `${API_URL}/api/reports/download/${predictionId}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
          <span className="mt-3 text-xs font-medium text-slate-400">Formatting clinical document...</span>
        </div>
      </div>
    );
  }

  if (!predictionId) {
    return (
      <div className="p-6 md:p-8 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <FileText size={22} />
        </div>
        <h3 className="font-outfit text-sm font-bold text-slate-900 mb-1">Select Diagnostic File</h3>
        <p className="text-[11px] text-slate-400 max-w-xs mb-4">Please navigate to the Patient History page to select a scan, or upload a new scan to compile reports.</p>
        <button
          onClick={() => navigate('/history')}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
        >
          <span>Open History</span>
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <AlertCircle size={22} />
        </div>
        <h3 className="font-outfit text-sm font-bold text-slate-900 mb-1">Report Error</h3>
        <p className="text-[11px] text-rose-500/80 max-w-xs mb-4">{error}</p>
        <button
          onClick={() => navigate('/history')}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <span>Return to History</span>
        </button>
      </div>
    );
  }

  const { prediction, report_text } = report;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const originalUrl = `${API_URL}${prediction.original_url.replace(API_URL, '')}`;
  const gradcamUrl = prediction.gradcam_url ? `${API_URL}${prediction.gradcam_url.replace(API_URL, '')}` : null;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-4xl mx-auto bg-white">
      {/* Back navigators */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft size={16} />
          <span>Patient Log</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
        >
          <FileDown size={14} />
          <span>Download PDF Document</span>
        </button>
      </div>

      {/* Main clinical layout */}
      <div className="flex flex-col gap-8 border border-slate-100 rounded-xl bg-white p-8 shadow-soft">
        
        {/* Document Header */}
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-6">
          <h2 className="font-outfit text-xl font-extrabold text-slate-900 tracking-tight">CLINICAL DIAGNOSTIC SUMMARY</h2>
          <p className="text-[10px] uppercase font-bold text-primary tracking-wider">Advanced AI Medical Intelligence Platform</p>
        </div>

        {/* Diagnostic Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-[11px] font-medium text-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Patient Ref:</span>
              <span className="font-semibold text-slate-900">Anonymous Patient</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scan ID:</span>
              <span className="font-mono text-slate-900">{prediction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">File Name:</span>
              <span className="text-slate-900 truncate max-w-[150px]">{prediction.filename}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Scanned Date:</span>
              <span className="text-slate-900 flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                <span>{new Date(prediction.created_at * 1000).toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Finding:</span>
              <span className={`font-bold ${prediction.predicted_class === 'PNEUMONIA' ? 'text-rose-600' : 'text-sky-600'}`}>
                {prediction.predicted_class}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model Confidence:</span>
              <span className="font-bold text-slate-900">{(prediction.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Media Attachments Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider">Radiographical Attachments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
            
            {/* Input image */}
            <div className="flex flex-col items-center gap-2">
              <div className="aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                <img src={originalUrl} alt="Original Radiography" className="h-full w-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Input Chest Radiography</span>
            </div>

            {/* Grad CAM image */}
            {gradcamUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                  <img src={gradcamUrl} alt="Grad-CAM map" className="h-full w-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Grad-CAM Feature Activation Map</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Medical Report Details */}
        <div className="flex flex-col gap-6 border-t border-slate-100 pt-6 text-xs text-slate-700">
          
          {/* Patient summary */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-outfit font-bold text-slate-900 uppercase tracking-wider">Patient Summary</h4>
            <p className="leading-relaxed text-slate-500">{report_text.patient_summary}</p>
          </div>

          {/* Clinical explanation */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-outfit font-bold text-slate-900 uppercase tracking-wider">Clinical Description</h4>
            <p className="leading-relaxed text-slate-500">{report_text.clinical_explanation}</p>
          </div>

          {/* Possible causes */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-outfit font-bold text-slate-900 uppercase tracking-wider">Differential Diagnostics (Possible Causes)</h4>
            <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500 pl-2">
              {report_text.possible_causes.map((cause: string, i: number) => (
                <li key={i} className="leading-relaxed">{cause}</li>
              ))}
            </ul>
          </div>

          {/* Clinical recommendations */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-outfit font-bold text-slate-900 uppercase tracking-wider">Clinical Recommendations</h4>
            <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500 pl-2">
              {report_text.recommendations.map((rec: string, i: number) => (
                <li key={i} className="leading-relaxed">{rec}</li>
              ))}
            </ul>
          </div>

          {/* Lifestyle suggestions */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-outfit font-bold text-slate-900 uppercase tracking-wider">Lifestyle Recommendations & Home Care</h4>
            <ul className="list-disc list-inside flex flex-col gap-1 text-slate-500 pl-2">
              {report_text.lifestyle_suggestions.map((sugg: string, i: number) => (
                <li key={i} className="leading-relaxed">{sugg}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-[10px] leading-relaxed text-amber-800">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert size={14} />
              <span>MEDICAL DISCLAIMER</span>
            </div>
            <p>{report_text.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
