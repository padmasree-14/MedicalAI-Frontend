import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, api } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password
      });
      const valid = await login(response.data.access_token);
      if (valid) {
        navigate('/dashboard');
      } else {
        setServerError('Session validation failed. Please check credentials.');
      }
    } catch (err: any) {
      console.error(err);
      setServerError(
        err.response?.data?.detail || 'Failed to authenticate. Ensure the backend is active.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-soft">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Activity size={24} />
          </div>
          <h2 className="font-outfit text-xl font-bold text-slate-900">Clinician Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your AI Medical Diagnostics workspace</p>
        </div>

        {/* Server Errors */}
        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Clinic Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="email"
                placeholder="clinician@hospital.org"
                {...register('email', { required: 'Email is required' })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.email.message as string}</span>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Access Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors"
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
              'Sign In to Workspace'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Need a workspace? </span>
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register Institution
          </Link>
        </div>
      </div>
    </div>
  );
};
