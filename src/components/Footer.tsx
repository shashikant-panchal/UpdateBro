import React, { useState } from 'react';
import { Check, Instagram, Mail, Send, Twitter, Youtube } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId } from '../types';
import { BrandLogo } from './BrandLogo';
import type { InfoModalTopic } from './InfoModal';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenInfo: (topic: Exclude<InfoModalTopic, null>) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenInfo, onReplayIntro }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 3500);
  };

  const jumpCatalog = (cat: CategoryId) => {
    onSelectCategory(cat);
  };

  return (
    <footer className="mt-16 border-t border-line bg-surface pb-10 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
        {/* Newsletter Club Card */}
        <div className="mb-12 rounded-card border border-line bg-gradient-to-r from-cloud via-accent-soft to-cloud p-6 sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full bg-surface px-3 py-1 text-[11px] font-extrabold tracking-wider text-ink">
                UB VIP CLUB • EARLY DROPS
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Get ₹250 Off Your First Drop &amp; Flash Alerts
              </h3>
              <p className="mt-1 text-sm text-muted">
                No spam—just early access to GaN tech drops, ANC launches, and firmware updates.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2.5 sm:flex-row lg:col-span-5"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="h-12 w-full rounded-btn border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-btn bg-ink px-5 text-sm font-bold text-canvas transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Join Club</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo className="text-ink" />
            <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
              Engineered for everyday creators, gamers, and commuters. Soft-touch aesthetics meet
              GaN III power and precision acoustics.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {[
                { label: 'Instagram', Icon: Instagram, url: 'https://instagram.com' },
                { label: 'YouTube', Icon: Youtube, url: 'https://youtube.com' },
                { label: 'X / Twitter', Icon: Twitter, url: 'https://x.com' },
              ].map(({ label, Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-btn border border-line bg-cloud text-muted transition hover:border-accent hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Shop Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpCatalog(c.id)}
                    className="text-left transition hover:text-ink"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              More Gear &amp; Support
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              {CATEGORIES.slice(5).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpCatalog(c.id)}
                    className="text-left transition hover:text-ink"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
              {onReplayIntro && (
                <li>
                  <button
                    type="button"
                    onClick={onReplayIntro}
                    className="inline-flex items-center gap-1.5 text-left font-bold text-accent transition hover:underline"
                  >
                    <span>▶ Watch Brand Intro</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('warranty')}
                  className="text-left font-semibold text-ink transition hover:underline"
                >
                  Warranty Registration
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
              Company &amp; Policies
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('replacement')}
                  className="text-left transition hover:text-ink"
                >
                  7-Day Replacement Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('shipping')}
                  className="text-left transition hover:text-ink"
                >
                  Shipping &amp; Delivery Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('gst')}
                  className="text-left transition hover:text-ink"
                >
                  Corporate &amp; Bulk GST Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('privacy')}
                  className="text-left transition hover:text-ink"
                >
                  Privacy Policy &amp; E-Waste Compliance
                </button>
              </li>
            </ul>
            <p className="mt-4 font-mono text-xs text-muted">Support: care@updatebro.in</p>
          </div>
        </div>

        {/* Bottom Copyright + Payment Badges */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} UPDATE BRO® Lifestyle Electronics. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-mono text-[11px] font-extrabold tracking-wider text-ink">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#2BAE66]" />
              UPI
            </span>
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-display text-[11px] font-black italic tracking-wider text-[#1A4DB3] dark:text-[#7FB0FF]">
              VISA
            </span>
            <span className="inline-flex h-7 items-center gap-1 rounded-md border border-line bg-cloud px-2.5 text-[11px] font-bold text-ink">
              <span className="inline-flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
                <span className="-ml-1.5 h-3 w-3 rounded-full bg-[#F79E1B]/90" />
              </span>
              Mastercard
            </span>
            <span className="inline-flex h-7 items-center rounded-md border border-line bg-cloud px-2.5 font-display text-[11px] font-extrabold tracking-wide text-ink">
              Ru<span className="text-[#F26522]">Pay</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
