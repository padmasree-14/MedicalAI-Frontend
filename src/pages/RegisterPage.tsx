import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Activity, Mail, Lock, User, Building, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parseErrorMsg = (err: any): string => {
    if (!err) return 'An unexpected registration error occurred.';
    
    if (err.response?.data?.detail) {
      const detail = err.response.data.detail;
      if (typeof detail === 'string') return detail;
      if (Array.isArray(detail)) {
        return detail.map((d: any) => d.msg || d.detail || JSON.stringify(d)).join(' | ');
      }
      if (typeof detail === 'object') return JSON.stringify(detail);
    }
    
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return `${err.message} (Target API: ${API_URL})`;
    return 'Registration failed. Network error or backend server unreachable.';
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);
    try {
      await api.post('/api/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        clinic_name: data.clinic_name
      });
      setSuccessMsg('Account registered successfully! Redirecting to login portal...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error("Registration submit error:", err);
      setServerError(parseErrorMsg(err));
      setLoading(false);
    }
  };

  const handleCustomApiUrl = () => {
    const current = localStorage.getItem('med_api_url') || API_URL;
    const input = prompt("Enter your Render Backend API URL (e.g. https://your-backend.onrender.com):", current);
    if (input !== null) {
      const trimmed = input.trim();
      if (trimmed) {
        localStorage.setItem('med_api_url', trimmed);
      } else {
        localStorage.removeItem('med_api_url');
      }
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-soft">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Activity size={24} />
          </div>
          <h2 className="font-outfit text-xl font-bold text-slate-900">Register Institution</h2>
          <p className="text-xs text-slate-400 mt-1">Deploy the AI Diagnostic Platform at your clinic</p>
        </div>

        {/* Server State Notifications */}
        {serverError && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="break-words leading-relaxed">{serverError}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-600">
            <Activity size={16} className="animate-pulse shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Clinician Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Dr. Sarah Jenkins"
                {...register('username', { required: 'Clinician name is required' })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors text-slate-800"
              />
            </div>
            {errors.username && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.username.message as string}</span>
            )}
          </div>

          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Clinic Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="email"
                placeholder="s.jenkins@hospital.org"
                {...register('email', { required: 'Email is required' })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors text-slate-800"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message as string}</span>
            )}
          </div>

          {/* Clinic name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Medical Institution</label>
            <div className="relative">
              <Building className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Saint Jude Pulmonary Center"
                {...register('clinic_name', { required: 'Institution name is required' })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors text-slate-800"
              />
            </div>
            {errors.clinic_name && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.clinic_name.message as string}</span>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Set Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors text-slate-800"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.password.message as string}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm disabled:bg-primary/50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Create Clinic Workspace'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>

        {/* API Backend URL Status & Override Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-1 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 max-w-full overflow-hidden truncate">
            <span>API URL:</span>
            <span className="font-mono text-slate-600 truncate max-w-[200px]">{API_URL}</span>
            <button
              type="button"
              onClick={handleCustomApiUrl}
              className="text-primary font-semibold hover:underline shrink-0"
            >
              [Change]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
