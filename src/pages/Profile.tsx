import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Building, 
  Lock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, api, updateUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload: any = {};
    if (data.clinic_name) payload.clinic_name = data.clinic_name;
    if (data.new_password) payload.password = data.new_password;

    try {
      const response = await api.post('/api/auth/profile', payload);
      updateUser(response.data.clinic_name);
      setSuccessMsg("Settings updated successfully.");
      reset(); // Clear passwords inputs
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to update profile parameters.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Workspace Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure your personal profile details, clinical affiliations, and passwords.</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft flex flex-col gap-6">
        
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-900">{user.username}</h3>
            <span className="text-[10px] text-slate-400 font-medium">Clinic: {user.clinic_name || 'General Clinic'}</span>
          </div>
        </div>

        {/* State Alerts */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Details */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* Clinician User (read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Clinician ID / Username</label>
            <input
              type="text"
              disabled
              value={user.username}
              className="h-10 w-full rounded-xl border border-slate-100 px-3 text-xs bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Email Address (read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Registered email</label>
            <input
              type="text"
              disabled
              value={user.email}
              className="h-10 w-full rounded-xl border border-slate-100 px-3 text-xs bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Clinic Name (editable) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Institution Affiliation Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={user.clinic_name}
                {...register('clinic_name')}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Reset Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={14} />
              <input
                type="password"
                placeholder="Enter new password (optional)"
                {...register('new_password', {
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            {errors.new_password && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.new_password.message as string}</span>
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
              'Save Account Changes'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
