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

// Safe date formatter wrapper used across the UI to avoid runtime
// exceptions when incoming date values are missing or malformed.
import { format, isValid } from 'date-fns';

export function formatDateSafe(value, fmt = 'MMM d, yyyy HH:mm', fallback = '—') {
  if (value === undefined || value === null || value === '') return fallback;

  let d;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === 'number') {
    d = new Date(value);
  } else if (typeof value === 'string') {
    // Let Date parse ISO strings and other common formats; this may still
    // produce an invalid date for malformed input, which we check below.
    d = new Date(value);
  } else {
    // Unknown type, try constructing Date anyway
    d = new Date(value);
  }

  if (!isValid(d)) return fallback;

  try {
    return format(d, fmt);
  } catch (e) {
    return fallback;
  }
}

