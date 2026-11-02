/**
 * Resolves a file or media asset URL.
 * If the URL is already absolute (e.g. Cloudinary HTTPS or external link), returns it directly.
 * If the URL is relative (e.g. /uploads/resources/...), prefixes it with the backend base URL.
 */
export const getFileUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // Get backend host without /api
  const apiBase = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api') as string;
  const backendHost = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  return `${backendHost}${cleanPath}`;
};

