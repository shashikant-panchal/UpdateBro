import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  MapPin,
  ShieldAlert,
  Scale,
  Package,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TermsOfServiceViewProps {
  onBack: () => void;
  onOpenPrivacy: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
  onBack,
  onOpenPrivacy,
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
              onClick={onOpenPrivacy}
              className="text-xs font-bold text-muted hover:text-accent transition"
            >
              Privacy Policy →
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
              <Scale className="h-4 w-4" />
              <span>TERMS &amp; CONDITIONS OF USE</span>
            </div>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Effective Date: {lastUpdated} • Please read these terms carefully before accessing or ordering from UPDATE BRO®.
            </p>
          </div>

          {/* Quick Notice Banner */}
          <div className="my-8 rounded-2xl border border-line bg-cloud/50 p-4 sm:p-5 text-xs sm:text-sm text-ink leading-relaxed">
            <p className="font-bold text-accent mb-1">Important Notice:</p>
            <p className="text-muted">
              These Terms of Service govern your use of the website, products, and services provided by <strong className="text-ink">UPDATE BRO®</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By browsing our site, signing in via Google, or purchasing any products, you agree to be bound by these terms. If you do not agree to these terms, please discontinue use of our platform.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10 text-xs sm:text-sm text-muted leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">1</span>
                <span>General Overview &amp; Eligibility</span>
              </h2>
              <p>
                UPDATE BRO® operates the digital storefront providing high-performance consumer electronic hardware, including GaN fast chargers, USB Type-C data cables, power banks, car charging adapters, wireless headphones, and TWS earbuds.
              </p>
              <p className="mt-2">
                To access or place orders on our site, you represent that you are at least 18 years old or are accessing the platform under the active supervision of a parent or legal guardian who agrees to be bound by these Terms.
              </p>
            </section>

            {/* Section 2: Account Registration & Google Authentication */}
            <section className="rounded-2xl border border-line bg-cloud/30 p-5 sm:p-6 text-ink">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">2</span>
                <span>User Accounts &amp; Google Sign-In</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                To streamline checkout and order tracking, our platform provides authentication via Google OAuth 2.0. By using Google Sign-In:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted">
                <li>You agree that the Google account used is your own legitimate account.</li>
                <li>You are responsible for maintaining the confidentiality of your Google account credentials and for all activities that occur under your session.</li>
                <li>You agree to provide true, accurate, current, and complete shipping and contact details (including a valid 10-digit Indian phone number) to ensure successful delivery.</li>
                <li>We reserve the right to suspend or terminate accounts that provide fraudulent contact details or engage in abusive order cancellations.</li>
              </ul>
            </section>

            {/* Section 3: Products, Pricing & Accuracy */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">3</span>
                <span>Products, Specifications &amp; Pricing</span>
              </h2>
              <p>
                We strive to display our hardware specifications, compatibility tables, and product colors as accurately as possible. However, actual colors may slightly vary depending on your monitor or display settings.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1.5">
                <li>All prices listed on the storefront are denominated in Indian National Rupees (INR ₹) and are inclusive of applicable Goods and Services Tax (GST).</li>
                <li>We reserve the right to modify prices, launch special combo deals, or discontinue products at any time without prior notice.</li>
                <li>In the rare event of a typographical error in pricing or product specifications, we reserve the right to correct the error and cancel any affected orders with immediate notification.</li>
              </ul>
            </section>

            {/* Section 4: Orders & Cash on Delivery (COD) */}
            <section className="rounded-2xl border-2 border-accent/20 bg-accent-soft/20 p-5 sm:p-6 text-ink">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-ink text-xs font-mono font-bold">4</span>
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  <span>Order Placement &amp; Cash on Delivery (COD)</span>
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                We offer convenient <strong>Cash on Delivery (COD)</strong> across eligible PIN codes in India with zero extra fees. By placing a COD order:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted">
                <li>
                  <strong>Commitment to Receive:</strong> A COD order constitutes a confirmed purchase commitment. You agree to ensure someone is available at the provided delivery address to receive the parcel and make payment.
                </li>
                <li>
                  <strong>Payment at Doorstep:</strong> Payment may be made via physical cash or by scanning the delivery executive&apos;s verified UPI QR code upon parcel arrival.
                </li>
                <li>
                  <strong>Verification:</strong> We may verify COD orders via automated SMS, WhatsApp, or telephone call prior to courier dispatch. Unconfirmed orders with invalid contact details may be cancelled.
                </li>
                <li>
                  <strong>Repeated Refusals:</strong> Customers who repeatedly refuse genuine COD shipments at their doorstep without valid reason may have their COD privileges permanently revoked.
                </li>
              </ul>
            </section>

            {/* Section 5: Shipping & Delivery */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">5</span>
                <span className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-accent" />
                  <span>Shipping &amp; Delivery Policy</span>
                </span>
              </h2>
              <p>
                We dispatch packages through trusted third-party courier partners (including Bluedart, Delhivery, Express Surface, and India Post) across India.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1.5">
                <li><strong>Dispatch Window:</strong> Confirmed orders are typically packed and dispatched within 24–48 business hours.</li>
                <li><strong>Delivery Timelines:</strong> Metro destinations generally arrive within 2–4 business days; regional and non-metro areas take approximately 4–7 business days.</li>
                <li><strong>Tracking:</strong> Live dispatch status and courier docket details can be tracked in real-time through the &quot;Your Orders&quot; section on our platform.</li>
                <li><strong>Delays:</strong> UPDATE BRO is not liable for unexpected delivery delays caused by courier logistics disruption, extreme weather conditions, or local governmental restrictions.</li>
              </ul>
            </section>

            {/* Section 6: 7-Day Replacement & 1-Year Warranty */}
            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">6</span>
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-accent" />
                  <span>7-Day Replacement Policy &amp; 1-Year Warranty</span>
                </span>
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-cloud/30 p-3.5">
                  <h3 className="font-bold text-ink text-xs uppercase tracking-wider">A. 7-Day Replacement Policy</h3>
                  <p className="mt-1 text-xs text-muted">
                    If your product arrives damaged, defective, or incorrect, you are entitled to a replacement within 7 calendar days of physical delivery. To claim:
                  </p>
                  <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-muted">
                    <li>Contact us via email (<a href="mailto:support@updatebro.in" className="text-accent underline font-bold">support@updatebro.in</a>) or WhatsApp with your Order ID and photo/video proof of unboxing.</li>
                    <li>Items must be returned in original condition with all retail packaging, user manuals, and included accessories.</li>
                    <li>Once verified, a fresh replacement unit will be dispatched at zero additional shipping fee.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-cloud/30 p-3.5">
                  <h3 className="font-bold text-ink text-xs uppercase tracking-wider">B. 1-Year Hardware Warranty</h3>
                  <p className="mt-1 text-xs text-muted">
                    UPDATE BRO® hardware units are covered by a 1-Year Official Replacement Warranty against manufacturing defects, internal circuit failures, and battery degradation under normal usage.
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted">
                    <em>Warranty Exclusions:</em> Physical impact damage, liquid immersion, unauthorized tampering/repairs, or misuse violating operating instructions are not covered.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Intellectual Property */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">7</span>
                <span>Intellectual Property Rights</span>
              </h2>
              <p>
                All trademarks, logos, service marks, graphics, visual user interfaces, audio design, product models, and software code on this platform are the sole proprietary intellectual property of <strong>UPDATE BRO®</strong> and are protected under Indian trademark and copyright laws.
              </p>
              <p className="mt-2">
                No portion of our platform or materials may be copied, reproduced, redistributed, scraped, or commercially exploited without our prior written authorization.
              </p>
            </section>

            {/* Section 8: Limitation of Liability */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">8</span>
                <span className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-accent" />
                  <span>Limitation of Liability &amp; Disclaimers</span>
                </span>
              </h2>
              <p>
                Our services and products are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. To the maximum extent permitted under applicable law, UPDATE BRO® disclaims all warranties, express or implied, other than those specifically stated in our written warranty cards.
              </p>
              <p className="mt-2">
                In no event shall UPDATE BRO, its directors, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from product misuse, third-party courier actions, or temporary website unavailability. Our aggregate liability for any proven claim shall not exceed the actual amount paid by you for the specific product in dispute.
              </p>
            </section>

            {/* Section 9: Governing Law & Jurisdiction */}
            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">9</span>
                <span>Governing Law &amp; Dispute Resolution</span>
              </h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you products shall be governed by and construed in accordance with the laws of the Republic of India.
              </p>
              <p className="mt-2 font-medium text-ink">
                Any legal dispute, suit, or claim arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Hyderabad, Telangana, India</strong>.
              </p>
            </section>

            {/* Section 10: Contact Information */}
            <section>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">10</span>
                <span>Customer Support &amp; Legal Notices</span>
              </h2>
              <p>
                For questions regarding these Terms of Service or to submit legal inquiries, please contact:
              </p>
              <div className="mt-4 space-y-2 rounded-xl border border-line bg-cloud/30 p-4 text-xs">
                <p className="font-bold text-ink">UPDATE BRO® — Customer Support &amp; Compliance</p>
                <p className="flex items-center gap-2 text-muted">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <span>Email: <a href="mailto:support@updatebro.in" className="font-bold text-accent hover:underline">support@updatebro.in</a></span>
                </p>
                <p className="flex items-center gap-2 text-muted">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <span>Corporate Location: Hyderabad, Telangana - 500034, India</span>
                </p>
                <p className="text-muted mt-1">
                  Brand Tagline: Power Your World. • Powering Connections.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Back & Privacy Links */}
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
              onClick={onOpenPrivacy}
              className="text-xs font-bold text-accent hover:underline"
            >
              Read Privacy Policy →
            </button>
          </div>
        </motion.article>
      </main>
    </div>
  );
};
