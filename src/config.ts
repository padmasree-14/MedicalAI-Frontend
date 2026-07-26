export const getApiUrl = (): string => {
  // 1. User manual override stored in browser localStorage
  if (typeof window !== 'undefined' && localStorage.getItem('med_api_url')) {
    const custom = localStorage.getItem('med_api_url')!.trim();
    if (custom) return custom.replace(/\/$/, '');
  }

  // 2. Environment variable from build
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== 'http://localhost:8000') {
    return envUrl.trim().replace(/\/$/, '');
  }

  // 3. If running on live domain (e.g. Vercel), default to Render backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return (envUrl || 'https://medical-ai-backend.onrender.com').trim().replace(/\/$/, '');
  }

  return 'http://localhost:8000';
};

export const API_URL = getApiUrl();
