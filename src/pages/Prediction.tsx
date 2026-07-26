import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Sparkles, 
  Eye, 
  FileDown, 
  AlertCircle,
  FileText,
  User
} from 'lucide-react';

export const Prediction: React.FC = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("Anonymous Patient");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  
  const [activeTab, setActiveTab] = useState<'original' | 'gradcam'>('original');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const loadSampleScan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/sample_scan.png');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'sample_radiography.png', { type: 'image/png' });
      setFile(sampleFile);
      setPreviewUrl(URL.createObjectURL(sampleFile));
      setResult(null);
      setError(null);
    } catch (err) {
      console.error('Failed to load sample scan:', err);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setResult(null);
      setError(null);
    }
  };

  const handlePredictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select or drop a radiography scan first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_name', patientName);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await api.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Append base url to response relative URLs
      const data = response.data;
      if (data.prediction.original_url) data.prediction.original_url = `${API_URL}${data.prediction.original_url}`;
      if (data.prediction.gradcam_url) data.prediction.gradcam_url = `${API_URL}${data.prediction.gradcam_url}`;
      
      setResult(data);
      setActiveTab('gradcam'); // Auto-switch to heatmap
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Scan prediction failed. Verify backend services.");
    } finally {
      setLoading(false);
    }
  };

  const downloadGradCam = () => {
    if (!result?.prediction?.gradcam_url) return;
    const link = document.createElement('a');
    link.href = result.prediction.gradcam_url;
    link.download = `gradcam_${result.prediction.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto bg-white">
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Inference Engine</h2>
        <p className="text-xs text-slate-400 mt-1">Upload pulmonary radiographies to run classifications and visualize network features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Column */}
        <div className="lg:col-span-5 rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col gap-6">
          <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase tracking-wider">New Scanning Task</h3>
          
          <form onSubmit={handlePredictSubmit} className="flex flex-col gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <User size={12} />
                <span>Patient Reference</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Dr. Jenkins / Patient Name"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs focus:border-primary focus:outline-none bg-white transition-colors text-slate-800"
              />
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                previewUrl 
                  ? 'border-primary/40 bg-primary/5' 
                  : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative w-full aspect-square max-w-[200px] overflow-hidden rounded-lg shadow-sm">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <UploadCloud size={20} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Choose Radiography Scan</span>
                  <span className="text-[10px] text-slate-400 mt-1">Drag & drop or browse local files</span>
                </div>
              )}
            </div>

            <button
              type="button"
              id="load-sample-scan-btn"
              onClick={loadSampleScan}
              className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer py-1"
            >
              + Load Sample Pneumonia Scan
            </button>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Running Deep Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Analyze Scan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {result ? (
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col gap-6">
              
              {/* Output Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-50 pb-4 gap-4">
                <div>
                  <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase tracking-wider">Classification Output</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Diagnosed Patient: {patientName}</p>
                </div>
                <span className={`inline-flex rounded-full px-3.5 py-1 text-xs font-bold ${
                  result.prediction.predicted_class === 'PNEUMONIA'
                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                    : 'bg-sky-50 text-sky-600 border border-sky-100'
                }`}>
                  {result.prediction.predicted_class}
                </span>
              </div>

              {/* Media Views Tabs */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 border-b border-slate-100 pb-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('original')}
                    className={`pb-2 px-1 transition-all ${
                      activeTab === 'original'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Input Image
                  </button>
                  <button
                    onClick={() => setActiveTab('gradcam')}
                    disabled={!result.prediction.gradcam_url}
                    className={`pb-2 px-1 transition-all disabled:opacity-40 ${
                      activeTab === 'gradcam'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Grad-CAM Map
                  </button>
                </div>

                {/* Tab content viewer */}
                <div className="relative aspect-square w-full max-w-[400px] mx-auto rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                  {activeTab === 'original' ? (
                    <img 
                      src={result.prediction.original_url} 
                      alt="Original Radiography" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={result.prediction.gradcam_url} 
                      alt="Grad-CAM Activation" 
                      className="h-full w-full object-cover" 
                    />
                  )}
                  
                  {activeTab === 'gradcam' && result.prediction.gradcam_url && (
                    <button
                      onClick={downloadGradCam}
                      className="absolute bottom-3 right-3 flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg bg-white/95 text-[10px] font-bold text-slate-800 hover:bg-white shadow-md transition-colors"
                    >
                      <FileDown size={14} />
                      <span>Download Heatmap</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Confidence bars & diagnostic notes */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Classification Confidence Score</span>
                    <span>{(result.prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.prediction.predicted_class === 'PNEUMONIA' ? 'bg-rose-500' : 'bg-primary'
                      }`}
                      style={{ width: `${result.prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Probability Distribution */}
                <div className="rounded-xl bg-slate-50 p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Diagnoses Classifications</span>
                  
                  {Object.entries(result.prediction.probabilities).map(([label, score]: any) => (
                    <div key={label} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-700">
                        <span>{label}</span>
                        <span>{(score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className={`h-full rounded-full ${label === 'PNEUMONIA' ? 'bg-rose-500/80' : 'bg-primary/80'}`} 
                          style={{ width: `${score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    onClick={() => navigate(`/reports?prediction_id=${result.prediction.id}`)}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <FileText size={14} />
                    <span>Open AI Diagnostics Report</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Eye size={22} />
              </div>
              <h3 className="font-outfit text-sm font-bold text-slate-900 mb-1">Waiting for Scan Upload</h3>
              <p className="text-[11px] text-slate-400 max-w-xs">Once you select a chest radiography and trigger diagnostic analysis, the classification report and feature activation maps will compile here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
