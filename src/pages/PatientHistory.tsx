import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  FileText, 
  Download, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const PatientHistory: React.FC = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const response = await api.get('/api/history');
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load history list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [api]);

  const handleDeleteItem = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this prediction scan? This action will clean up image assets and compiled PDF documents.")) {
      return;
    }
    
    setDeleteError(null);
    try {
      await api.delete(`/api/history/${id}`);
      // Refresh list
      setHistory(history.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.response?.data?.detail || "Failed to delete prediction record.");
    }
  };

  const handleDownloadPDF = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const downloadUrl = `${API_URL}/api/reports/download/${id}`;
      // Open download URL in new tab or trigger directly
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error("PDF download request failed:", err);
    }
  };

  // Filter list by filename or label
  const filteredHistory = history.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.filename.toLowerCase().includes(query) ||
      item.predicted_class.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
          <span className="mt-3 text-xs font-medium text-slate-400">Querying patient files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-bold text-slate-900">Patient History</h2>
          <p className="text-xs text-slate-400 mt-1">Review diagnostic records, visual heatmaps, and downloadable PDF summaries.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans or diagnostics..."
            className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none bg-white transition-colors text-slate-800"
          />
        </div>
      </div>

      {deleteError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          <AlertCircle size={14} />
          <span>{deleteError}</span>
        </div>
      )}

      {filteredHistory.length > 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white shadow-soft overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase">
                  <th className="p-4">Scan Thumbnails</th>
                  <th className="p-4">Scan File Name</th>
                  <th className="p-4">Diagnosis Class</th>
                  <th className="p-4">Confidence Metric</th>
                  <th className="p-4">Scanned Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {filteredHistory.map((item) => {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                  const origThumb = `${API_URL}${item.original_url.replace(API_URL, '')}`;
                  
                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => navigate(`/reports?prediction_id=${item.id}`)}
                      className="hover:bg-slate-50/30 transition-colors cursor-pointer"
                    >
                      {/* Thumbnail view */}
                      <td className="p-4">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                          <img src={origThumb} alt="Scan mini" className="h-full w-full object-cover" />
                        </div>
                      </td>
                      
                      <td className="p-4 font-semibold text-slate-900 max-w-[200px] truncate">
                        {item.filename}
                      </td>
                      
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                          item.predicted_class === 'PNEUMONIA'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-sky-50 text-sky-600'
                        }`}>
                          {item.predicted_class}
                        </span>
                      </td>
                      
                      <td className="p-4 text-slate-600">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>
                      
                      <td className="p-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>
                            {new Date(item.created_at * 1000).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleDownloadPDF(item.id, e)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            title="Download Report PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/reports?prediction_id=${item.id}`)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
                            title="Open Report Page"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Records"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Sparkles size={22} />
          </div>
          <h3 className="font-outfit text-sm font-bold text-slate-900 mb-1">No Diagnostic Files Located</h3>
          <p className="text-[11px] text-slate-400 max-w-xs mb-4">You have not completed any diagnostic scans, or your current search filters do not match existing records.</p>
          <button
            onClick={() => navigate('/prediction')}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
          >
            <span>Scan First Image</span>
          </button>
        </div>
      )}
    </div>
  );
};
