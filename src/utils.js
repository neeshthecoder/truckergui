// src/utils.js

/**
 * Creates a URL path for navigating to a page.
 * This function preserves the case of the page name (e.g., /Dashboard) 
 * and handles embedded query parameters (e.g., /Operators?tab=alerts).
 */
export function createPageUrl(pageName) {
  // Handle query parameters if included in pageName
  // e.g., "Dashboard?tab=alerts" -> ["Dashboard", "tab=alerts"]
  const [page, queryString] = pageName.split('?');
  
  // Base44 documentation indicates the base path uses the page name directly (case-sensitive)
  const basePath = `/${page}`;
  
  // Reconstruct the URL with query string if present
  return queryString ? `${basePath}?${queryString}` : basePath;
}

