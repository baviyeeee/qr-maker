/**
 * Cookie and Storage Utility for Theme Preferences
 */

export function setCookie(name: string, value: string, days = 365): void {
  try {
    const maxAge = days * 24 * 60 * 60;
    // Set cookie with SameSite=Lax and path=/
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    console.warn('Failed to set cookie:', e);
  }

  // Backup in localStorage for offline/sandboxed environments
  try {
    localStorage.setItem(name, value);
  } catch {
    // Ignore storage quota/security errors
  }
}

export function getCookie(name: string): string | null {
  try {
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split('; ');
      const prefix = `${encodeURIComponent(name)}=`;
      for (const cookie of cookies) {
        if (cookie.startsWith(prefix)) {
          return decodeURIComponent(cookie.substring(prefix.length));
        }
      }
    }
  } catch (e) {
    console.warn('Failed to read cookie:', e);
  }

  // Fallback to localStorage if cookie not available
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}

export function deleteCookie(name: string): void {
  try {
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // Ignore
  }
  try {
    localStorage.removeItem(name);
  } catch {
    // Ignore
  }
}
