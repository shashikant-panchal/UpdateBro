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
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    user,
    profile,
    isAuthModalOpen,
    closeAuthModal,
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

              {/* Direct Frontend Google Sign-In with ID Token (Domain Stays On www.updatebro.in) */}
              <div className="flex justify-center w-full py-1">
                <GoogleLogin
                  onSuccess={async (credentialResponse: CredentialResponse) => {
                    if (!credentialResponse.credential) {
                      setErrorMsg('Google sign-in did not return a valid credential token.');
                      return;
                    }
                    try {
                      setIsSubmitting(true);
                      setErrorMsg(null);
                      const { error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: credentialResponse.credential,
                      });
                      if (error) throw error;
                      setSuccessMsg('Signed in successfully!');
                      setTimeout(() => {
                        closeAuthModal();
                      }, 500);
                    } catch (err: unknown) {
                      setErrorMsg(err instanceof Error ? err.message : 'Google authentication failed.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  onError={() => {
                    setErrorMsg('Google sign-in was cancelled or encountered an error.');
                  }}
                  theme="outline"
                  shape="pill"
                  size="large"
                  text="continue_with"
                  width="100%"
                />
              </div>

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
