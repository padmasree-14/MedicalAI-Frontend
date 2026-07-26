import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  LineChart, 
  Grid3X3,
  Award
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { api } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get('/api/analytics');
        setMetrics(response.data.ml_metrics);
      } catch (err) {
        console.error("Failed to load ML model metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [api]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
          <span className="mt-3 text-xs font-medium text-slate-400">Loading deep learning parameter sets...</span>
        </div>
      </div>
    );
  }

  // Format Recharts history data
  const historyData: any[] = [];
  if (metrics?.history) {
    const epochsCount = metrics.history.loss.length;
    for (let i = 0; i < epochsCount; i++) {
      historyData.push({
        epoch: `Epoch ${i + 1}`,
        loss: metrics.history.loss[i],
        val_loss: metrics.history.val_loss[i],
        accuracy: metrics.history.accuracy[i],
        val_accuracy: metrics.history.val_accuracy[i],
      });
    }
  }

  const rocPlotUrl = `${API_URL}/static/metrics/roc_curve.png`;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Neural Network Parameters</h2>
        <p className="text-xs text-slate-400 mt-1">Detailed evaluation metrics, training history plots, and classification parameters.</p>
      </div>

      {metrics ? (
        <div className="flex flex-col gap-8">
          
          {/* Key Parameters Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Validation Accuracy</span>
              <span className="font-outfit text-2xl font-bold text-slate-900">{(metrics.accuracy * 100).toFixed(1)}%</span>
              <span className="text-[9px] text-emerald-600 font-semibold mt-1">▲ Target Achieved</span>
            </div>
            
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recall (Sensitivity)</span>
              <span className="font-outfit text-2xl font-bold text-slate-900">{(metrics.recall * 100).toFixed(1)}%</span>
              <span className="text-[9px] text-slate-400 mt-1">True Positive rate</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precision</span>
              <span className="font-outfit text-2xl font-bold text-slate-900">{(metrics.precision * 100).toFixed(1)}%</span>
              <span className="text-[9px] text-slate-400 mt-1">Diagnostic reliability</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">F1-Score</span>
              <span className="font-outfit text-2xl font-bold text-slate-900">{(metrics.f1_score * 100).toFixed(1)}%</span>
              <span className="text-[9px] text-slate-400 mt-1">Harmonic mean</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROC Area (AUC)</span>
              <span className="font-outfit text-2xl font-bold text-slate-900">{(metrics.auc).toFixed(3)}</span>
              <span className="text-[9px] text-slate-400 mt-1">Classifier separability</span>
            </div>
          </div>

          {/* Graphs & Confusion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Confusion Matrix (4 columns equivalent) */}
            <div className="lg:col-span-4 rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col justify-between">
              <div>
                <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <Grid3X3 size={14} className="text-primary" />
                  <span>Confusion Matrix</span>
                </h3>
                
                {/* 2x2 grid representing CM */}
                <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto text-center font-outfit">
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">True Neg (TN)</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">{metrics.confusion_matrix.tn}</span>
                  </div>
                  <div className="rounded-lg bg-rose-50/30 p-4 border border-rose-100">
                    <span className="block text-[10px] font-bold text-rose-500 uppercase">False Pos (FP)</span>
                    <span className="text-xl font-bold text-rose-700 mt-1 block">{metrics.confusion_matrix.fp}</span>
                  </div>
                  <div className="rounded-lg bg-rose-50/30 p-4 border border-rose-100">
                    <span className="block text-[10px] font-bold text-rose-500 uppercase">False Neg (FN)</span>
                    <span className="text-xl font-bold text-rose-700 mt-1 block">{metrics.confusion_matrix.fn}</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">True Pos (TP)</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">{metrics.confusion_matrix.tp}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 mt-6 leading-relaxed border-t border-slate-50 pt-4 text-center">
                Metrics calculated on test subsets of synthesized chest radiography samples.
              </div>
            </div>

            {/* ROC Curve Plot */}
            <div className="lg:col-span-8 rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
              <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <LineChart size={14} className="text-primary" />
                <span>ROC Threshold Analysis</span>
              </h3>
              <div className="flex justify-center items-center">
                <img 
                  src={rocPlotUrl} 
                  alt="Model ROC Curve" 
                  className="rounded-lg max-h-[300px] w-auto border border-slate-100 shadow-sm"
                  onError={(e) => {
                    // Hide if not loaded or failed
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Recharts Training Curves */}
          {historyData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Accuracy Curve */}
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
                <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Model Training Accuracy Curve</h3>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorValAcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="epoch" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" domain={[0, 1]} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="accuracy" name="Train Accuracy" stroke="#2563EB" strokeWidth={2} fill="url(#colorAcc)" />
                      <Area type="monotone" dataKey="val_accuracy" name="Val Accuracy" stroke="#0EA5E9" strokeWidth={2} fill="url(#colorValAcc)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Loss Curve */}
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
                <h3 className="font-outfit text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Model Training Loss Curve</h3>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorValLoss" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="epoch" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="loss" name="Train Loss" stroke="#2563EB" strokeWidth={2} fill="url(#colorLoss)" />
                      <Area type="monotone" dataKey="val_loss" name="Val Loss" stroke="#0EA5E9" strokeWidth={2} fill="url(#colorValLoss)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Award size={22} />
          </div>
          <h3 className="font-outfit text-sm font-bold text-slate-900 mb-1">Metrics Loading Error</h3>
          <p className="text-[11px] text-slate-400 max-w-xs">No local training summary logs (`metrics.json`) could be located on the server. Train the deep learning model to output execution metrics.</p>
        </div>
      )}
    </div>
  );
};
