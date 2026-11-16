import React from 'react';
import { motion } from 'framer-motion';
import { Building2, FileSpreadsheet, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMotionConfig } from '../hooks/useMotionConfig';

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: '1-Year Warranty',
    subtitle: 'Hassle-free coverage on every UB SKU',
    tint: '#7ED4AD',
  },
  {
    icon: RefreshCw,
    title: '7-Day Instant Replace',
    subtitle: 'Zero-questions doorstep swap guarantee',
    tint: '#B8B8FF',
  },
  {
    icon: Building2,
    title: '700+ Service Centers',
    subtitle: 'Pan-India express walk-in & pickup network',
    tint: '#FF9B85',
  },
  {
    icon: FileSpreadsheet,
    title: '100% GST Billing',
    subtitle: 'Instant corporate tax credit invoices',
    tint: '#8ECAE6',
  },
];

export const TrustStrip: React.FC = () => {
  const { isReduced } = useMotionConfig();

  return (
    <section className="mx-auto max-w-[1920px] px-4 pt-16 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={isReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-soft"
            >
              {/* Custom Pastel Vector Badge */}
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-black/5 dark:border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${item.tint}45, ${item.tint}18)`,
                }}
              >
                <svg
                  viewBox="0 0 56 56"
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                  aria-hidden="true"
                >
                  <circle cx="44" cy="12" r="9" fill={item.tint} />
                  <circle cx="12" cy="46" r="5" fill={item.tint} />
                </svg>
                <Icon className="relative h-6 w-6 text-ink" strokeWidth={2.2} />
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-ink sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs leading-snug text-muted">{item.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Brand & Manufacturing Highlight Banner */}
      <div className="mt-6 rounded-card border border-line bg-gradient-to-r from-surface via-accent-soft to-surface p-4 sm:p-5 shadow-soft">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-display text-sm font-black text-ink">UPDATE BRO®</span>
              <span className="text-xs text-muted">•</span>
              <span className="text-xs font-extrabold text-accent">Power Your World.</span>
              <span className="text-xs text-muted">•</span>
              <span className="text-xs font-semibold text-muted">
                Manufactured &amp; Powered by <strong className="text-ink">NEXGENTEQ</strong>
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Hyderabad, Telangana, India • Delivering quality, performance, reliability and modern technology at affordable prices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
