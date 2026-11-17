import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';

export type InfoModalTopic =
  | 'about'
  | 'warranty'
  | 'replacement'
  | 'shipping'
  | 'gst'
  | 'privacy'
  | null;

interface InfoModalProps {
  topic: InfoModalTopic;
  onClose: () => void;
}

const TOPIC_COPY: Record<
  Exclude<InfoModalTopic, null>,
  { title: string; subtitle: string; points: string[] }
> = {
  about: {
    title: 'UPDATE BRO® — Power Your World',
    subtitle: 'Next-generation mobile accessories designed for performance, durability, and style.',
    points: [
      'UPDATE BRO is a next-generation mobile accessories brand — Power Your World.',
      'We specialize in innovative mobile accessories, including fast chargers, data cables, power banks, car chargers, TWS earbuds and connectivity solutions.',
      'Our mission is to deliver quality, performance, reliability and modern technology at affordable prices.',
      'UPDATE BRO – Powering Connections.',
      'Power Your World – Every Device, Everywhere.',
    ],
  },
  warranty: {
    title: '1-Year Instant Replacement Warranty',
    subtitle: 'Register your UPDATE BRO® serial number in 15 seconds for priority service.',
    points: [
      'Covers manufacturing, battery, driver, and GaN circuit defects for 12 months.',
      'Walk-in instant swap across 700+ authorized centers or free doorstep pickup.',
      'Valid across all TWS earbuds, smartwatches, power banks, GaN chargers & cables.',
    ],
  },
  replacement: {
    title: '7-Day Hassle-Free Replacement Policy',
    subtitle: 'Instant replacement on damaged, defective, or incorrect items delivered.',
    points: [
      'Raise a swap within 7 calendar days of delivery with unboxing proof.',
      'Zero reverse-pickup fees on verified hardware issues.',
      'Replacement unit dispatches immediately upon courier pickup scan.',
    ],
  },
  shipping: {
    title: 'Shipping & Express Delivery',
    subtitle: 'Free Express Shipping on all orders ₹499 and above.',
    points: [
      'Orders placed before 4:00 PM IST dispatch the exact same business day.',
      'Metro delivery in 1–2 business days; rest of India in 3–4 business days.',
      'Live SMS & WhatsApp courier alerts sent automatically upon dispatch.',
    ],
  },
  gst: {
    title: 'Corporate, Bulk & GST Billing',
    subtitle: '100% GST Tax Invoice for businesses, startups, and gifting orders.',
    points: [
      'Enter your 15-digit GSTIN during invoice request to claim 18% Input Tax Credit.',
      'Custom laser engraving of company logos available on UB power banks & TWS.',
      'Tiered volume pricing starting at just 15 units — contact care@updatebro.in.',
    ],
  },
  privacy: {
    title: 'Privacy Policy & E-Waste Compliance',
    subtitle: 'Safe recycling and transparent customer data protection.',
    points: [
      'We only collect shipping and warranty details strictly needed to fulfill your order.',
      'Zero third-party ad data reselling — ever.',
      'Drop off old electronics at any UB service center for certified Li-ion recycling.',
    ],
  },
};

export const InfoModal: React.FC<InfoModalProps> = ({ topic, onClose }) => {
  const [serial, setSerial] = useState('');
  const [registered, setRegistered] = useState(false);

  const info = topic ? TOPIC_COPY[topic] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;
    setRegistered(true);
    setSerial('');
    window.setTimeout(() => setRegistered(false), 3000);
  };

  return (
    <AnimatePresence>
      {info && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="relative z-10 w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-ink">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">{info.title}</h2>
                  <p className="text-xs text-muted">{info.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-btn p-1.5 text-muted hover:bg-cloud hover:text-ink"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-ink sm:text-sm">
              {info.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {topic === 'about' && (
              <div className="mt-4 rounded-xl border border-line bg-cloud/70 p-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-muted">Brand</span>
                    <p className="font-bold text-ink">UPDATE BRO®</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted">Tagline</span>
                    <p className="font-bold text-accent">Power Your World.</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted">Location</span>
                    <p className="font-medium text-ink">Hyderabad, Telangana, India</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted">Official Website</span>
                    <p className="font-mono font-bold text-accent">www.updatebro.in</p>
                  </div>
                </div>
                <div className="mt-3 border-t border-line/60 pt-2 text-[11px] text-muted">
                  <p><span className="font-bold text-ink">UPDATE BRO</span> – Powering Connections.</p>
                  <p><span className="font-bold text-accent">Power Your World.</span> – Next-Gen Accessories.</p>
                </div>
              </div>
            )}

            {topic === 'warranty' && (
              <form onSubmit={handleSubmit} className="mt-5 rounded-btn border border-line bg-cloud p-3.5">
                <label className="block text-xs font-bold text-ink">
                  Quick Serial / SKU Registration
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    required
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="e.g. UB-PODS-ANC1"
                    className="h-9 flex-1 rounded-btn border border-line bg-surface px-3 font-mono text-xs uppercase text-ink focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-9 rounded-btn bg-accent px-4 text-xs font-bold text-accent-ink hover:bg-accent-hover"
                  >
                    {registered ? 'Registered!' : 'Register'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 flex justify-end border-t border-line pt-4">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-btn bg-ink px-5 text-xs font-bold text-canvas dark:bg-accent dark:text-accent-ink"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
