import React, { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  text?: 'continue_with' | 'signin_with' | 'signup_with';
  className?: string;
}

const DEFAULT_GOOGLE_CLIENT_ID =
  '557708693889-dbab359762a0arbm38gn23h5cemaojrm.apps.googleusercontent.com';

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  onLoadingChange,
  text = 'continue_with',
  className = '',
}) => {
  const { resolvedTheme } = useTheme();
  const { signInWithGoogle, signInWithGoogleIdToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isDark = resolvedTheme === 'dark';

  // Read environment variable for Google Client ID (with production fallback)
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
  const clientId = typeof rawClientId === 'string' ? rawClientId.trim() : '';

  // Valid Google Client ID must be configured (typically ends with .apps.googleusercontent.com)
  const isGoogleConfigured = Boolean(
    clientId &&
    clientId.length > 10 &&
    !clientId.includes('placeholder') &&
    !clientId.includes('YOUR_')
  );

  const setLocalLoading = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  // Handler for direct Frontend Google Sign-In with ID Token (react-oauth/google)
  const handleIdTokenSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      const msg = 'Google authentication did not return a valid credential token.';
      onError?.(msg);
      return;
    }

    try {
      setLocalLoading(true);
      const res = await signInWithGoogleIdToken(credentialResponse.credential);
      if (res.error) {
        onError?.(res.error.message || 'Authentication with Supabase failed.');
      } else {
        onSuccess?.();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      onError?.(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleIdTokenError = () => {
    onError?.('Google sign-in was cancelled or encountered an error.');
  };

  // Fallback handler for Supabase OAuth redirect flow (when VITE_GOOGLE_CLIENT_ID is not yet configured)
  const handleFallbackSignIn = async () => {
    try {
      setLocalLoading(true);
      await signInWithGoogle();
      // Browser redirects to Google OAuth
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to launch Google sign-in.';
      onError?.(msg);
      setLocalLoading(false);
    }
  };

  const getLabelText = () => {
    if (isLoading) return 'Connecting to Google...';
    if (text === 'signin_with') return 'Sign in with Google';
    if (text === 'signup_with') return 'Sign up with Google';
    return 'Continue with Google';
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      {isGoogleConfigured ? (
        /* Direct Frontend Google Sign-In (when Client ID is provided in .env) */
        <div className="flex justify-center w-full py-0.5">
          <GoogleLogin
            onSuccess={handleIdTokenSuccess}
            onError={handleIdTokenError}
            theme={isDark ? 'filled_black' : 'outline'}
            shape="pill"
            size="large"
            text={text}
            width="340"
          />
        </div>
      ) : (
        /* High-End Styled Google Button (supports both Dark and Light theme) */
        <button
          type="button"
          onClick={handleFallbackSignIn}
          disabled={isLoading}
          aria-label={getLabelText()}
          className={`group relative flex h-11 w-full max-w-[340px] items-center justify-center gap-3 rounded-full px-5 text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
            isDark
              ? 'bg-[#131314] text-white border border-[#3c4043] hover:bg-[#1E1F20] hover:border-[#5f6368] shadow-md shadow-black/30'
              : 'bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#c6c8cc] shadow-sm hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2.5">
              <div
                className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                  isDark ? 'border-white' : 'border-[#3c4043]'
                }`}
              />
              <span className="text-xs font-semibold">{getLabelText()}</span>
            </div>
          ) : (
            <>
              {/* Official Google 'G' Multi-Color Vector Logo */}
              <svg
                className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.9 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="font-medium">{getLabelText()}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
