import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  UserCheck, 
  Activity, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_predictions: 0,
    normal_count: 0,
    pneumonia_count: 0,
    average_confidence: 0
  });
  const [diseaseDistribution, setDiseaseDistribution] = useState<any[]>([]);
  const [monthlyAnalysis, setMonthlyAnalysis] = useState<any[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          api.get('/api/analytics'),
          api.get('/api/history')
        ]);
        
        const data = analyticsRes.data;
        setStats(data.stats);
        setDiseaseDistribution(data.disease_distribution);
        setMonthlyAnalysis(data.monthly_analysis);
        
        // Take top 5 recent predictions
        setRecentPredictions(historyRes.data.slice(0, 5));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [api]);

  const COLORS = ['#0EA5E9', '#E11D48']; // sky blue for NORMAL, rose red for PNEUMONIA

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
          <span className="mt-3 text-xs font-medium text-slate-400">Compiling analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto bg-white">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-bold text-slate-900">Diagnostic Overview</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time deep learning analytics and scan activity logs.</p>
        </div>
        <button
          onClick={() => navigate('/prediction')}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Sparkles size={14} />
          <span>New Analysis Scan</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Total Scans Run</span>
            <span className="font-outfit text-2xl font-bold text-slate-900">{stats.total_predictions}</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Detection Rate</span>
            <span className="font-outfit text-2xl font-bold text-slate-900">
              {stats.total_predictions > 0 
                ? `${((stats.pneumonia_count / stats.total_predictions) * 100).toFixed(1)}%` 
                : '0.0%'}
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Activity size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Clear Pulmonaries</span>
            <span className="font-outfit text-2xl font-bold text-slate-900">{stats.normal_count}</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <UserCheck size={20} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Mean Confidence</span>
            <span className="font-outfit text-2xl font-bold text-slate-900">
              {stats.total_predictions > 0 ? `${(stats.average_confidence * 100).toFixed(1)}%` : '0.0%'}
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline Area Chart */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft lg:col-span-2">
          <h3 className="font-outfit text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Monthly Diagnostic Volume</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyAnalysis}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Distribution */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col justify-between">
          <h3 className="font-outfit text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Classification Split</h3>
          <div className="h-56 w-full flex items-center justify-center text-xs">
            {stats.total_predictions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400">No predictions recorded.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Predictions Activity */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
          <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity Logs</h3>
          <button 
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Full History</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentPredictions.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Scan Image</th>
                  <th className="pb-3">Predicted Label</th>
                  <th className="pb-3">Confidence Value</th>
                  <th className="pb-3">Diagnostic Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 max-w-[200px] truncate">{pred.filename}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                        pred.predicted_class === 'PNEUMONIA'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-sky-50 text-sky-600'
                      }`}>
                        {pred.predicted_class}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{(pred.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3 text-slate-400">
                      {new Date(pred.created_at * 1000).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate('/history')}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-xs text-slate-400">No predictions recorded yet. Run a scan to populate the dashboard!</span>
          </div>
        )}
      </div>
    </div>
  );
};
