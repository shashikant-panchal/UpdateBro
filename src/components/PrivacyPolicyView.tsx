import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  MapPin,
  Lock,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  onOpenTerms: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onBack,
  onOpenTerms,
}) => {
  const lastUpdated = 'November 20, 2026';

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cloud/50 px-3.5 py-1.5 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Store</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-line pl-3">
              <BrandLogo variant="monogram" className="h-5 w-5 text-accent" />
              <span className="font-display text-sm font-bold tracking-tight text-ink">
                UPDATE BRO®
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-xs font-bold text-muted hover:text-accent transition"
            >
              Terms of Service →
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-line bg-surface p-6 sm:p-10 md:p-12 shadow-soft"
        >
          {/* Title Header */}
          <div className="border-b border-line pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-extrabold text-accent">
              <ShieldCheck className="h-4 w-4" />
              <span>LEGAL COMPLIANCE &amp; DATA PROTECTION</span>
            </div>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Effective Date: {lastUpdated} • Applicable to all UPDATE BRO® digital platforms, storefronts, and authenticated services.
            </p>
          </div>

          {/* Quick Notice Banner */}
          <div className="my-8 rounded-2xl border border-line bg-cloud/50 p-4 sm:p-5 text-xs sm:text-sm text-ink leading-relaxed">
            <p className="font-bold text-accent mb-1">Summary Commitment:</p>
            <p className="text-muted">
              At <strong className="text-ink">UPDATE BRO®</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your privacy and are committed to protecting your personal data. We do not sell, rent, or trade your personal information. We only collect details strictly necessary to authenticate your account, fulfill hardware deliveries, provide live order tracking, and deliver customer support.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-xs sm:text-sm text-muted leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">1</span>
                <span>Who We Are &amp; Scope</span>
              </h2>
              <p>
                This Privacy Policy applies to the online platform operated by <strong>UPDATE BRO®</strong>, based in Hyderabad, Telangana, India. UPDATE BRO is a next-generation consumer electronics and mobile accessories brand specializing in fast chargers, GaN technology, high-speed data cables, audio solutions, TWS earbuds, and mobile lifestyle hardware.
              </p>
              <p className="mt-2">
                By accessing our website, placing an order, or authenticating via Google Sign-In, you acknowledge that you have read and agreed to the practices outlined in this policy.
              </p>
            </section>

            {/* Section 2: Google OAuth Disclosure */}
            <section className="rounded-2xl border-2 border-accent/30 bg-accent-soft/20 p-5 sm:p-6 text-ink">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-ink text-xs font-mono font-bold">2</span>
                <span className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-accent" />
                  <span>Google OAuth 2.0 User Data &amp; Authentication</span>
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Our storefront integrates Google Sign-In (OAuth 2.0) to provide a friction-free, secure sign-in experience without requiring you to create and remember separate passwords.
              </p>
              
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-line bg-surface p-3.5">
                  <h3 className="font-bold text-ink text-xs uppercase tracking-wider">A. Information Received from Google</h3>
                  <p className="mt-1 text-xs text-muted">
                    When you authenticate using Google, we access only the basic profile scopes authorized by you:
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-muted">
                    <li><strong>Full Name</strong>: Used to personalize your order invoice and greeting.</li>
                    <li><strong>Email Address</strong>: Used as your unique account identifier and to send order confirmation updates.</li>
                    <li><strong>Profile Picture URL</strong>: Used solely to display your avatar in the navigation bar.</li>
                    <li><strong>Google User ID</strong>: A unique token provided by Google to verify your authentication session.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-surface p-3.5">
                  <h3 className="font-bold text-ink text-xs uppercase tracking-wider">B. How We Use Google Account Data</h3>
                  <p className="mt-1 text-xs text-muted">
                    Google user data is used exclusively to:
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-muted">
                    <li>Authenticate and log you into your UPDATE BRO customer account.</li>
                    <li>Display and track your placed orders via the live &quot;Your Orders&quot; portal.</li>
                    <li>Prefill your delivery contact information so you don&apos;t need to retype it at checkout.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/40 bg-surface p-3.5">
                  <h3 className="font-bold text-accent text-xs uppercase tracking-wider">C. Google API Limited Use Disclosure</h3>
                  <p className="mt-1 text-xs font-medium text-ink leading-relaxed">
                    UPDATE BRO&apos;s use and transfer to any other app of information received from Google APIs will strictly adhere to the <strong className="text-accent underline">Google API Services User Data Policy</strong>, including the Limited Use requirements.
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted">
                    We do NOT use Google user data for serving advertisements, and we do NOT transfer or sell this data to data brokers, advertising networks, or third-party analytic services.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Information We Collect Directly */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">3</span>
                <span>Information We Collect Directly From You</span>
              </h2>
              <p>In addition to Google OAuth, we collect information you provide directly during checkout or customer support inquiries:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-ink">Delivery Information:</strong> Physical shipping address (House/Flat, Street, Landmark, City, State, PIN code) and 10-digit mobile contact number needed for delivery dispatch and courier coordination.
                </li>
                <li>
                  <strong className="text-ink">Order Records:</strong> Products purchased, variant colors, item quantities, total amount, timestamp, and order status history.
                </li>
                <li>
                  <strong className="text-ink">Payment Information:</strong> For Cash on Delivery (COD), we record payment status upon physical delivery. We do not store or process sensitive debit/credit card numbers on our servers.
                </li>
                <li>
                  <strong className="text-ink">Customer Support:</strong> Communications, warranty registration numbers, or inquiries sent via WhatsApp or email.
                </li>
              </ul>
            </section>

            {/* Section 4: Data Storage & Security */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">4</span>
                <span>Data Storage, Security &amp; Encryption</span>
              </h2>
              <p>
                We employ industry-standard administrative, physical, and technical safeguards:
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-cloud/30 p-3.5">
                  <div className="flex items-center gap-2 font-bold text-ink text-xs mb-1">
                    <Lock className="h-4 w-4 text-accent" />
                    <span>256-Bit SSL/TLS Encryption</span>
                  </div>
                  <p className="text-xs text-muted">
                    All network communication between your browser and our servers is encrypted in transit using modern TLS protocols.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-cloud/30 p-3.5">
                  <div className="flex items-center gap-2 font-bold text-ink text-xs mb-1">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Row Level Security (RLS)</span>
                  </div>
                  <p className="text-xs text-muted">
                    Database tables strictly enforce PostgreSQL Row Level Security; users can only access orders and profile data tied to their own authenticated ID.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Data Sharing & Third Parties */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">5</span>
                <span>Data Sharing &amp; Third Parties</span>
              </h2>
              <p>
                We share personal information strictly with vetted service providers necessary for operating our storefront:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Logistics &amp; Courier Partners:</strong> Name, phone number, and shipping address are transmitted to reliable Indian logistics couriers (e.g., Bluedart, Delhivery, Express Surface, India Post) solely for physical order delivery.
                </li>
                <li>
                  <strong>Cloud Infrastructure:</strong> Supabase (hosted on AWS) for secure cloud database hosting and Google Cloud Identity for OAuth authentication.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by applicable Indian law, court order, or governmental regulation.
                </li>
              </ul>
              <p className="mt-2 font-semibold text-ink">
                We never sell, rent, monetize, or trade your personal data to any third-party advertisers or telemarketers.
              </p>
            </section>

            {/* Section 6: User Rights & Data Deletion */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">6</span>
                <span>Your Rights &amp; Account Deletion</span>
              </h2>
              <p>
                Under the Indian Digital Personal Data Protection Act (DPDP Act) and international data protection standards, you have the right to:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Access and review the personal data associated with your account.</li>
                <li>Request rectification of incorrect or outdated shipping addresses or contact numbers.</li>
                <li>Request complete erasure of your account and personal details from our databases.</li>
              </ul>
              <div className="mt-3 rounded-xl border border-line bg-cloud/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Trash2 className="h-4 w-4 text-accent" />
                  <span>How to Request Data Deletion</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  To delete your account and associated data, simply email us from your registered email address at <a href="mailto:support@updatebro.in" className="font-bold text-accent hover:underline">support@updatebro.in</a> with the subject line <em>&quot;Account Deletion Request&quot;</em>. Our administrative team will process your request and permanently erase your account data within 7 business days.
                </p>
              </div>
            </section>

            {/* Section 7: E-Waste Management */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">7</span>
                <span>E-Waste Management Compliance</span>
              </h2>
              <p>
                As an eco-conscious electronics brand, UPDATE BRO adheres to the E-Waste (Management) Rules established by the Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India.
              </p>
              <p className="mt-2">
                Do not dispose of defective chargers, lithium-ion power banks, or wireless earbuds in standard municipal waste. Contact our support team for channelized collection and certified recycling through authorized E-Waste recycling partners.
              </p>
            </section>

            {/* Section 8: Grievance Officer & Contact Information */}
            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">8</span>
                <span>Grievance Officer &amp; Contact Information</span>
              </h2>
              <p>
                If you have any questions, concerns, or grievances regarding this Privacy Policy or our data handling practices, please contact our designated Grievance Officer:
              </p>
              <div className="mt-4 space-y-2 rounded-xl border border-line bg-cloud/30 p-4 text-xs">
                <p className="font-bold text-ink">Grievance Officer — UPDATE BRO®</p>
                <p className="flex items-center gap-2 text-muted">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <span>Official Email: <a href="mailto:support@updatebro.in" className="font-bold text-accent hover:underline">support@updatebro.in</a></span>
                </p>
                <p className="flex items-center gap-2 text-muted">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <span>Corporate Location: Hyderabad, Telangana - 500034, India</span>
                </p>
                <p className="text-muted mt-1">
                  Response Window: Grievances are acknowledged within 48 hours and resolved within 30 days as mandated by the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Back & Terms Links */}
          <div className="mt-10 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-xs font-bold text-canvas transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Storefront</span>
            </button>

            <button
              type="button"
              onClick={onOpenTerms}
              className="text-xs font-bold text-accent hover:underline"
            >
              Read Terms of Service →
            </button>
          </div>
        </motion.article>
      </main>
    </div>
  );
};
