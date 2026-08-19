/**
 * Utility to resolve static asset URLs (images, PDFs, documents)
 * across both local dev environment and production deployment (e.g. GitHub Pages).
 * 
 * @param {string} path - Relative asset path (e.g. './asset/project1.png' or '/report/Report_DSA.pdf')
 * @returns {string} Fully qualified or normalized URL path.
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Remove leading './' or '/'
  const cleanPath = path.replace(/^(\.\/|\/)/, '');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${normalizedBase}${cleanPath}`;
}
