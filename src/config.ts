export const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== 'http://localhost:8000') {
    return envUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return (envUrl || 'https://medical-ai-backend.onrender.com').replace(/\/$/, '');
  }
  return 'http://localhost:8000';
};

export const API_URL = getApiUrl();
