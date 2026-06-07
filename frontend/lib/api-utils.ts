export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // Remove leading slash from path if it exists to avoid double slashes
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${normalizedPath}`;
};
