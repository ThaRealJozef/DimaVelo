import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useManifestSwitcher() {
  const location = useLocation();

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    
    if (!manifestLink) {
      console.warn('[PWA] Manifest link not found in document');
      return;
    }

    // Switch manifest based on current route
    if (location.pathname.startsWith('/admin')) {
      if (manifestLink.getAttribute('href') !== '/manifest-admin.json') {
        console.log('[PWA] Switching to admin manifest');
        manifestLink.setAttribute('href', '/manifest-admin.json');
        
        // Update theme color for admin
        const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#1e293b');
        }
      }
    } else {
      if (manifestLink.getAttribute('href') !== '/manifest.json') {
        console.log('[PWA] Switching to main manifest');
        manifestLink.setAttribute('href', '/manifest.json');
        
        // Update theme color for main site
        const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#16a34a');
        }
      }
    }
  }, [location.pathname]);
}