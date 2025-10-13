import { Platform } from 'react-native';
import React from 'react';

/**
 * CanvasKit loader for React Native Skia web support
 * 
 * This utility ensures CanvasKit is loaded on web platform before Skia charts are rendered.
 * On native platforms (iOS/Android), Skia works natively without CanvasKit.
 * 
 * Usage:
 * ```tsx
 * const isReady = useCanvasKitLoader();
 * if (!isReady) return <LoadingIndicator />;
 * return <SkiaChart />;
 * ```
 */

let canvasKitLoadPromise: Promise<void> | null = null;
let canvasKitLoaded = false;
let canvasKitLoadError: Error | null = null;

/**
 * Load CanvasKit for web platform
 * Returns immediately on native platforms
 */
export async function loadCanvasKit(): Promise<void> {
  // On native platforms, CanvasKit is not needed
  if (Platform.OS !== 'web') {
    canvasKitLoaded = true;
    return Promise.resolve();
  }

  // Return existing promise if already loading
  if (canvasKitLoadPromise) {
    return canvasKitLoadPromise;
  }

  // Already loaded successfully
  if (canvasKitLoaded) {
    return Promise.resolve();
  }

  // Had previous error
  if (canvasKitLoadError) {
    return Promise.reject(canvasKitLoadError);
  }

  // Start loading CanvasKit
  canvasKitLoadPromise = (async () => {
    try {
      // Dynamic import of Skia's web loader - only happens at runtime on web
      const { LoadSkiaWeb } = await import(
        /* webpackChunkName: "skia-web" */
        '@shopify/react-native-skia/lib/module/web'
      );
      
      // Load CanvasKit from public directory
      await LoadSkiaWeb({
        locateFile: (file: string) => {
          // CanvasKit WASM file is served from /public/canvaskit.wasm
          if (file.endsWith('.wasm')) {
            return `/canvaskit.wasm`;
          }
          return file;
        },
      });

      canvasKitLoaded = true;
      console.log('[CanvasKit] Successfully loaded for web platform');
    } catch (error) {
      canvasKitLoadError = error instanceof Error ? error : new Error('Failed to load CanvasKit');
      console.error('[CanvasKit] Failed to load:', error);
      throw canvasKitLoadError;
    }
  })();

  return canvasKitLoadPromise;
}

/**
 * Check if CanvasKit is loaded and ready
 */
export function isCanvasKitReady(): boolean {
  // On native, always ready (CanvasKit not needed)
  if (Platform.OS !== 'web') {
    return true;
  }
  
  return canvasKitLoaded;
}

/**
 * Get any loading error
 */
export function getCanvasKitError(): Error | null {
  return canvasKitLoadError;
}

/**
 * React hook to load CanvasKit with loading state
 */
export function useCanvasKitLoader() {
  const [isReady, setIsReady] = React.useState(isCanvasKitReady());
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // If already ready, no need to load
    if (isCanvasKitReady()) {
      setIsReady(true);
      return;
    }

    setIsLoading(true);
    
    loadCanvasKit()
      .then(() => {
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { isReady, isLoading, error };
}
