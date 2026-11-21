import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Palette,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Save,
  Sun,
  Moon,
  Laptop,
  AlertCircle,
  Truck,
  XCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbOrder, DbOrderItem, OrderStatus } from '../types/database';
import type { ThemeMode } from '../types';

export type ProfileTab = 'details' | 'orders' | 'personalization';

interface OrderWithItems extends DbOrder {
  order_items: DbOrderItem[];
}

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Received & queued' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Verified by team' },
  { status: 'Processing', label: 'Packing', desc: 'Tested & packaged' },
  { status: 'Dispatched', label: 'Dispatched', desc: 'In transit via courier' },
  { status: 'Delivered', label: 'Delivered', desc: 'Delivered to doorstep' },
];

interface UserProfileViewProps {
  onBack: () => void;
  initialTab?: ProfileTab;
  onGoHome?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBack,
  initialTab = 'details',
}) => {
  const { user, profile, updateProfile, signOut, signInWithGoogle } = useAuth();
  const { mode, setMode } = useTheme();

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  // Form editable states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Customer Orders State
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderWithItems | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setShippingAddress(profile.shipping_address || '');
    } else if (user) {
      const meta = user.user_metadata || {};
      setFullName(meta.full_name || meta.name || user.email?.split('@')[0] || '');
      setPhone(user.phone || meta.phone || '');
    }
  }, [profile, user]);

  // Load orders strictly for this authenticated user
  const fetchUserOrders = async () => {
    if (!user || !isSupabaseConfigured) return;
    try {
      setIsLoadingOrders(true);

      const cleanPhone = (profile?.phone || phone || '').replace(/\D/g, '');
      let query = supabase
        .from('orders')
        .select(`
          id, order_number, user_id, customer_name, customer_phone,
          shipping_address, payment_method, payment_status, razorpay_payment_id,
          subtotal, shipping_fee, total_amount, status, status_history, tracking_note,
          created_at, updated_at,
          order_items ( id, product_name, product_image, quantity, unit_price )
        `)
        .order('created_at', { ascending: false });

      // Strictly restrict query to current authenticated customer
      if (cleanPhone.length >= 10) {
        const phone10 = cleanPhone.slice(-10);
        query = query.or(`user_id.eq.${user.id},customer_phone.ilike.%${phone10}%`);
      } else {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (!error && data) {
        setOrders(data as OrderWithItems[]);
      }
    } catch (err) {
      console.warn('Failed to load customer orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, profile?.phone]);

  // Realtime subscription for orders
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    const channel = supabase
      .channel(`profile-user-orders-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUserOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        shipping_address: shippingAddress.trim(),
      });

      if (res?.error) {
        throw res.error;
      }

      setSaveSuccess('Profile details and address updated successfully!');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return ORDER_STEPS.findIndex((s) => s.status === status);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-500">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-500">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-indigo-500">
            <Truck className="h-3 w-3" /> Dispatched
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[11px] font-extrabold text-accent">
            <Package className="h-3 w-3" /> Packing
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[11px] font-extrabold text-accent">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[11px] font-extrabold text-accent">
            <Clock className="h-3 w-3" /> Order Placed
          </span>
        );
    }
  };

  // IF GUEST: PROMPT WITH SIGN IN
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-canvas text-ink">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-line bg-surface p-7 text-center shadow-xl sm:p-9"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent shadow-glow">
            <User className="h-8 w-8" />
          </div>

          <h2 className="mt-5 font-display text-2xl font-black text-ink">
            My Account &amp; Profile
          </h2>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Sign in with Google to view your live orders, manage saved delivery addresses, and customize your experience.
          </p>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-cloud px-4 py-3.5 text-xs font-bold text-ink transition hover:border-accent hover:bg-surface shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-2xl border border-line px-4 py-2.5 text-xs font-bold text-muted hover:text-ink transition"
            >
              Back to Storefront
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Top Back Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2 text-xs font-bold text-muted hover:border-accent hover:text-ink transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2 text-xs font-bold text-rose-500 hover:border-rose-500 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Identity Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-black text-ink">
                  {fullName || 'UpdateBro Member'}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                  <ShieldCheck className="h-3 w-3" /> Flagship Member
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted font-mono">{user.email}</p>
              {phone && <p className="mt-0.5 text-xs text-muted font-mono">{phone}</p>}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-line bg-cloud/50 px-4 py-3 text-center min-w-[90px]">
                <p className="text-xl font-black text-ink">{orders.length}</p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Orders</p>
              </div>
              <div className="rounded-2xl border border-line bg-cloud/50 px-4 py-3 text-center min-w-[90px]">
                <p className="text-xl font-black text-emerald-500">
                  {orders.filter((o) => o.status === 'Delivered').length}
                </p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mt-6 flex items-center gap-2 border-b border-line pb-3 overflow-x-auto">
          {[
            { id: 'details', label: 'My Details & Address', icon: User },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'personalization', label: 'Personalization & Theme', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as ProfileTab);
                  setActiveOrder(null);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'border border-accent bg-accent text-white shadow-glow'
                    : 'border border-line bg-surface text-muted hover:text-ink hover:border-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: USER DETAILS & ADDRESS */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-500">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Personal Information */}
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm space-y-4">
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Full Name"
                        className="h-11 w-full rounded-2xl border border-line bg-cloud/40 pl-10 pr-3.5 text-xs font-bold text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="email"
                        disabled
                        value={user.email || ''}
                        className="h-11 w-full rounded-2xl border border-line bg-cloud/20 pl-10 pr-3.5 text-xs font-mono font-bold text-muted cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted mb-1.5">
                      Contact Phone (for delivery &amp; dispatch updates)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-11 w-full rounded-2xl border border-line bg-cloud/40 pl-10 pr-3.5 text-xs font-mono font-bold text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Couriers will send tracking notifications and SMS OTP to this phone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>Default Shipping Address</span>
                  </h3>
                  {shippingAddress && (
                    <span className="text-[11px] font-bold text-emerald-500">✓ Address Saved</span>
                  )}
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House / Flat No., Street, Landmark, Area, City, State - PIN Code"
                    className="w-full rounded-2xl border border-line bg-cloud/40 p-3.5 text-xs font-medium text-ink placeholder:text-muted focus:border-accent focus:outline-none resize-none leading-relaxed"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    This address will be auto-filled during checkout so you can place orders in one click.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs font-bold text-white shadow-glow hover:bg-accent-hover transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile & Address'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {isLoadingOrders ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-muted">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-line bg-surface p-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-cloud text-muted">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-black text-ink">No Orders Yet</h3>
                <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                  You haven&apos;t placed any orders yet. Explore our curated drop of next-gen accessories!
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-5 rounded-2xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:bg-accent-hover transition"
                >
                  Explore Storefront
                </button>
              </div>
            ) : activeOrder ? (
              /* DETAILED ORDER VIEW */
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline mb-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Orders List</span>
                </button>

                <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm space-y-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-accent">
                          #{activeOrder.order_number}
                        </span>
                        {getStatusBadge(activeOrder.status)}
                      </div>
                      <p className="text-xs text-muted mt-1">
                        Placed on {new Date(activeOrder.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-black text-ink">₹{activeOrder.total_amount}</p>
                      <p className={`text-[11px] font-bold ${
                        activeOrder.payment_method === 'ONLINE' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {activeOrder.payment_method === 'ONLINE'
                          ? `Paid Online (Razorpay${activeOrder.razorpay_payment_id ? ` • ${activeOrder.razorpay_payment_id}` : ''})`
                          : 'Cash on Delivery (COD)'}
                      </p>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {activeOrder.status !== 'Cancelled' && (
                    <div className="py-2">
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">
                        Delivery Status
                      </h4>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {ORDER_STEPS.map((step, idx) => {
                          const currentIdx = getStepIndex(activeOrder.status);
                          const isDone = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;
                          return (
                            <div key={step.status} className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                                  isDone
                                    ? 'bg-accent text-white shadow-glow'
                                    : 'bg-cloud text-muted border border-line'
                                } ${isCurrent ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''}`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <p className={`mt-2 text-[10px] font-bold leading-tight ${isDone ? 'text-ink' : 'text-muted'}`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ordered Items */}
                  <div>
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                      Ordered Products
                    </h4>
                    <div className="space-y-3">
                      {activeOrder.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl border border-line bg-cloud/30 p-3"
                        >
                          <img
                            src={item.product_image || '/assets/ub-logo-official.jpg'}
                            alt={item.product_name}
                            className="h-14 w-14 rounded-xl object-contain bg-surface border border-line p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-ink truncate">{item.product_name}</p>
                            <p className="text-[11px] text-muted">
                              Qty: {item.quantity} × ₹{item.unit_price}
                            </p>
                          </div>
                          <p className="font-bold text-xs text-ink">
                            ₹{item.quantity * item.unit_price}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="rounded-2xl border border-line bg-cloud/40 p-4 text-xs space-y-1">
                    <p className="font-bold text-muted uppercase tracking-wider text-[10px]">
                      Delivery Destination
                    </p>
                    <p className="font-bold text-ink">{activeOrder.customer_name}</p>
                    <p className="text-muted leading-relaxed">{activeOrder.shipping_address}</p>
                    <p className="text-muted font-mono">{activeOrder.customer_phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ORDERS LIST */
              <div className="space-y-3">
                {orders.map((ord) => {
                  const firstItem = ord.order_items?.[0];
                  return (
                    <motion.div
                      key={ord.id}
                      onClick={() => setActiveOrder(ord)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5 shadow-sm hover:border-accent transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={firstItem?.product_image || '/assets/ub-logo-official.jpg'}
                          alt={firstItem?.product_name || 'Order'}
                          className="h-14 w-14 rounded-2xl object-contain bg-cloud/50 border border-line p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-accent">
                              #{ord.order_number}
                            </span>
                            {getStatusBadge(ord.status)}
                          </div>
                          <p className="font-bold text-xs text-ink truncate mt-0.5">
                            {firstItem?.product_name || 'Flagship Item'}
                            {ord.order_items && ord.order_items.length > 1
                              ? ` + ${ord.order_items.length - 1} more`
                              : ''}
                          </p>
                          <p className="text-[11px] text-muted">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-line pt-2.5 sm:pt-0">
                        <div className="text-right">
                          <p className="font-black text-sm text-ink">₹{ord.total_amount}</p>
                          <span className={`inline-block text-[10px] font-bold ${
                            ord.payment_method === 'ONLINE' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>
                            {ord.payment_method === 'ONLINE' ? 'Paid Online' : 'Cash on Delivery'}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: PERSONALIZATION & THEME */}
        {activeTab === 'personalization' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                  Storefront Display Theme
                </h3>
                <p className="text-xs text-muted mt-1">
                  Choose your preferred appearance mode across the storefront.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'light' as ThemeMode,
                    title: 'Clean Studio Daylight',
                    desc: 'Crisp white & neutral background with high-contrast geometry.',
                    icon: Sun,
                  },
                  {
                    id: 'dark' as ThemeMode,
                    title: 'OLED Stealth Black',
                    desc: 'Deep blacks and pure cyber orange glow accents.',
                    icon: Moon,
                  },
                  {
                    id: 'system' as ThemeMode,
                    title: 'Device Adaptive',
                    desc: 'Automatically synchronizes with your device preferences.',
                    icon: Laptop,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = mode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMode(opt.id)}
                      className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-glow'
                          : 'border-line bg-cloud/30 hover:border-accent'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border mb-3 ${
                        isSelected ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-bold text-xs text-ink">{opt.title}</p>
                      <p className="text-[11px] text-muted mt-1 leading-relaxed">{opt.desc}</p>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-accent">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active Mode</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
