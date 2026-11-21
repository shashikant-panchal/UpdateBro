import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Package,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    user,
    profile,
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    updatePhone,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'options' | 'linkPhone'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If user is logged in but has no phone, prompt to link
  const needsPhoneLink = Boolean(user && (!profile?.phone || profile.phone.trim() === ''));

  React.useEffect(() => {
    if (isAuthModalOpen && needsPhoneLink) {
      setAuthMethod('linkPhone');
    } else if (isAuthModalOpen && !user) {
      setAuthMethod('options');
    }
  }, [isAuthModalOpen, needsPhoneLink, user]);

  React.useEffect(() => {
    if (!isAuthModalOpen) {
      document.body.style.overflow = '';
      return;
    }
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig || '';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Google sign-in encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const res = await updatePhone(cleanPhone);
      if (res.error) {
        setErrorMsg(res.error.message);
      } else {
        setSuccessMsg('Mobile number linked successfully!');
        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to link mobile number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl text-ink cursor-default"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-cloud hover:text-ink transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <BrandLogo variant="monogram" className="h-7 w-7 text-accent" />
            <span className="font-display font-black text-xl tracking-tight text-ink">UPDATE BRO®</span>
          </div>
          <span className="mt-1 text-[11px] font-semibold text-muted">
            Official Customer Portal
          </span>
        </div>

        {/* Dynamic Forms */}
        <div className="mt-6">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-500"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* VIEW 1: Google OAuth Sign In */}
          {authMethod === 'options' && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-ink">Welcome to UPDATE BRO</h3>
                <p className="mt-1 text-xs text-muted max-w-xs mx-auto">
                  Sign in with Google to view live orders, save delivery addresses, and enjoy seamless checkout.
                </p>
              </div>

              {/* Value Perks */}
              <div className="space-y-2 rounded-2xl border border-line bg-cloud/40 p-3.5 text-xs text-muted">
                <div className="flex items-center gap-2 text-ink">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-medium">100% Secure Google OAuth 2.0 Sign-in</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <Package className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-medium">Real-time live order dispatch tracking</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <Zap className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-medium">Saved addresses &amp; one-tap instant bag sync</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:border-[#4285F4] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              <p className="text-center text-[11px] text-muted leading-relaxed">
                By continuing, you agree to UPDATE BRO&apos;s{' '}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent underline hover:text-accent-hover transition"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent underline hover:text-accent-hover transition"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>
          )}

          {/* VIEW 2: Link Mobile Number to Signed-in Google Account */}
          {authMethod === 'linkPhone' && (
            <form onSubmit={handleLinkPhone} className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">Add Mobile Number</h3>
                <p className="mt-1 text-xs text-muted">
                  Add your 10-digit mobile number so courier delivery updates and order dispatch alerts reach you instantly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Mobile Number</label>
                <div className="flex rounded-2xl border border-line bg-surface overflow-hidden focus-within:border-accent">
                  <span className="flex items-center bg-cloud px-3 text-xs font-mono font-bold text-ink border-r border-line">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="h-12 w-full bg-transparent px-3 text-sm font-mono text-ink placeholder:text-muted focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.length < 10}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-accent-hover disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Saving...' : 'Save Mobile Number'}</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={closeAuthModal}
                className="w-full text-center text-xs font-bold text-muted hover:text-ink transition"
              >
                Skip for now
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
