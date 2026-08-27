// Reason: Removed PWA install button from the codebase per user request.
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Check if it was already fired before React mounted
    if ((window as any).__isPWAInstallable) {
      setIsInstallable(true);
    }

    const handleInstallable = () => setIsInstallable(true);
    window.addEventListener('pwa-installable', handleInstallable);

    const handleInstalled = () => {
      (window as any).__deferredPrompt = null;
      (window as any).__isPWAInstallable = false;
      setIsInstallable(false);
    };
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const prompt = (window as any).__deferredPrompt;
    if (!prompt) {
      alert("You can install this app manually by clicking the 'Install' icon in your browser's address bar, or 'Add to Home Screen' in the menu.");
      return;
    }
    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        (window as any).__deferredPrompt = null;
        (window as any).__isPWAInstallable = false;
        setIsInstallable(false);
      }
    } catch (err) {
      console.error('Failed to prompt PWA install:', err);
    }
  }, []);

  return { isInstallable, promptInstall };
}
