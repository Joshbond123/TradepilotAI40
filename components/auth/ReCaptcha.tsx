import React, { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
    recaptchaOnLoad?: () => void;
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired?: () => void;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ siteKey, onVerify, onExpired }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = React.useState(0);

  const renderRecaptcha = useCallback(() => {
    if (!containerRef.current || !window.grecaptcha || !window.grecaptcha.render) {
      console.log('ReCAPTCHA: Waiting for grecaptcha to load...');
      return;
    }

    // Skip if already rendered
    if (widgetIdRef.current !== null) {
      console.log('ReCAPTCHA: Already rendered, skipping');
      return;
    }

    try {
      console.log('ReCAPTCHA: Rendering widget with siteKey:', siteKey?.substring(0, 10) + '...');
      console.log('ReCAPTCHA: Current domain:', window.location.hostname);
      
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          console.log('ReCAPTCHA: Verification successful');
          setError(null);
          onVerify(token);
          // Reset trigger to allow re-verification on next attempt
          setResetTrigger(prev => prev + 1);
        },
        'expired-callback': () => {
          console.log('ReCAPTCHA: Token expired');
          if (onExpired) onExpired();
          // Auto-reset the widget when expired
          if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
            try {
              window.grecaptcha.reset(widgetIdRef.current);
              console.log('ReCAPTCHA: Widget auto-reset after expiration');
            } catch (e) {
              console.error('ReCAPTCHA: Failed to reset after expiration', e);
            }
          }
        },
        'error-callback': () => {
          console.error('ReCAPTCHA: Error callback triggered - Domain not authorized or network issue');
          // Don't set error state here as it causes the widget to disappear
          // Just log it for debugging
        },
        theme: 'dark',
      });
      setIsLoading(false);
      setError(null);
      console.log('ReCAPTCHA: Widget rendered successfully, ID:', widgetIdRef.current);
    } catch (error) {
      console.error('ReCAPTCHA: Render error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Only show critical errors that prevent initial loading
      if (errorMessage.includes('reCAPTCHA has already been rendered')) {
        console.log('ReCAPTCHA: Already rendered, this is safe to ignore');
        setIsLoading(false);
      } else {
        setError(`Failed to initialize reCAPTCHA. Please check your site key configuration.`);
        setIsLoading(false);
      }
    }
  }, [siteKey, onVerify, onExpired]);

  useEffect(() => {
    if (!siteKey) {
      console.log('ReCAPTCHA: No site key provided');
      setError('reCAPTCHA site key is missing');
      setIsLoading(false);
      return;
    }

    console.log('ReCAPTCHA: Initializing with site key:', siteKey?.substring(0, 10) + '...');
    
    // Check if script already exists to prevent duplicates
    const existingScript = document.querySelector('script[src*="google.com/recaptcha/api.js"]');
    
    if (!window.grecaptcha && !existingScript) {
      console.log('ReCAPTCHA: Loading script...');
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad&render=explicit';
      script.async = true;
      script.defer = true;
      
      window.recaptchaOnLoad = () => {
        console.log('ReCAPTCHA: Script loaded successfully, rendering widget...');
        setTimeout(() => renderRecaptcha(), 100);
      };
      
      script.onerror = (e) => {
        console.error('ReCAPTCHA: Failed to load script from Google. Network error or blocked by browser.', e);
        setError('Unable to load reCAPTCHA from Google servers. Check your internet connection or browser settings.');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    } else if (window.grecaptcha?.render) {
      console.log('ReCAPTCHA: Script already loaded, rendering widget...');
      setTimeout(() => renderRecaptcha(), 100);
    } else {
      console.log('ReCAPTCHA: grecaptcha exists but render not ready, waiting...');
      let checkInterval: NodeJS.Timeout | null = null;
      let timeoutId: NodeJS.Timeout | null = null;
      
      checkInterval = setInterval(() => {
        if (window.grecaptcha?.render) {
          if (checkInterval) clearInterval(checkInterval);
          renderRecaptcha();
        }
      }, 100);
      
      timeoutId = setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
        if (!window.grecaptcha?.render) {
          console.error('ReCAPTCHA: Timeout - grecaptcha.render not available after 10 seconds');
          setError('reCAPTCHA took too long to load. Please refresh the page and try again.');
          setIsLoading(false);
        }
      }, 10000);
      
      return () => {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    return () => {
      // Cleanup: Only reset if widget exists and API is available
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
          console.log('ReCAPTCHA: Widget reset on unmount');
        } catch (e) {
          console.log('ReCAPTCHA: Cleanup error (safe to ignore)');
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, renderRecaptcha]);

  return (
    <div className="flex flex-col items-center justify-center my-4 min-h-[78px]">
      {isLoading && !error && (
        <div className="text-brand-text-secondary text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          Loading reCAPTCHA...
        </div>
      )}
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 px-4 py-3 rounded-lg space-y-2 max-w-md mb-4">
          <div className="font-semibold">⚠️ reCAPTCHA Error</div>
          <div>{error}</div>
          {error.includes('domain') && (
            <div className="text-xs text-red-300/80 mt-2 pt-2 border-t border-red-500/20">
              <strong>How to fix:</strong> Go to <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="underline">Google reCAPTCHA Admin</a>, 
              select your site, and add <code className="bg-red-900/40 px-1 rounded">{window.location.hostname}</code> to the authorized domains list.
            </div>
          )}
        </div>
      )}
      <div ref={containerRef}></div>
    </div>
  );
};

export default ReCaptcha;
