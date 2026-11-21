import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  XCircle,
  BellRing,
  ChevronRight,
  Phone,
  Mail,
  User,
  CreditCard,
  Truck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbOrder, DbOrderItem, OrderStatus } from '../types/database';

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

interface CustomerOrdersViewProps {
  onBack: () => void;
  selectedOrderNumber?: string;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  onBack,
  selectedOrderNumber,
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch customer orders
  const loadOrders = async () => {
    if (!user || !isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const cleanPhone = (profile?.phone || '').replace(/\D/g, '');
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

      if (cleanPhone.length >= 10) {
        const phone10 = cleanPhone.slice(-10);
        query = query.or(`user_id.eq.${user.id},customer_phone.ilike.%${phone10}%`);
      } else {
        query = query.eq('user_id', user.id);
      }

      const { data: ordersData, error: ordersErr } = await query;

      if (!ordersErr && ordersData) {
        const mapped = ordersData as OrderWithItems[];
        setOrders(mapped);
        if (selectedOrderNumber) {
          const match = mapped.find((o) => o.order_number === selectedOrderNumber);
          if (match) setActiveOrder(match);
        }
      }
    } catch (err) {
      console.warn('Error fetching customer orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // Realtime subscription strictly filtered to current user's ID
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const channelName = `realtime-orders-${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as DbOrder;
          if (updated && updated.id) {
            setToastMessage(`⚡ Order ${updated.order_number} status updated to ${updated.status}!`);
            setTimeout(() => setToastMessage(null), 4500);

            setOrders((prev) =>
              prev.map((ord) => {
                if (ord.id === updated.id) {
                  const merged = { ...ord, ...updated };
                  if (activeOrder?.id === updated.id) {
                    setActiveOrder((prevActive) => (prevActive ? { ...prevActive, ...updated } : merged));
                  }
                  return merged;
                }
                return ord;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeOrder?.id]);

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

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 text-center shadow-xl text-ink"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-black text-ink">Track Your Orders Live</h2>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            Sign in to view your placed orders, track courier dispatches in real-time, and view full delivery details.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={openAuthModal}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-bold text-accent-ink shadow-glow transition hover:bg-accent-hover"
            >
              <span>Sign In / Continue</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-muted hover:text-ink transition"
            >
              ← Back to Storefront
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-8 sm:px-6 lg:px-8 text-ink">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-accent bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl text-ink"
          >
            <BellRing className="h-5 w-5 text-accent animate-bounce" />
            <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl">
        {/* VIEW 1: MASTER LIST OF ORDERS */}
        {!activeOrder ? (
          <div>
            {/* Top Bar Navigation */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink transition hover:border-accent"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Store</span>
                </button>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-ink">Your Orders</h1>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-extrabold text-accent">
                    {orders.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-semibold">{profile?.full_name || user.email}</span>
              </div>
            </div>

            {/* List Content */}
            {isLoading ? (
              <div className="py-24 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-muted">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-line bg-surface p-12 text-center shadow-soft">
                <Package className="mx-auto h-12 w-12 text-muted" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink">No Orders Yet</h3>
                <p className="mt-1 text-xs text-muted">
                  You haven't placed any orders yet. Discover our next-gen audio and accessories!
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs font-bold text-accent-ink shadow-glow transition hover:bg-accent-hover"
                >
                  <span>Explore Catalog</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {orders.map((ord) => {
                  const firstItem = ord.order_items?.[0];
                  const extraItemsCount = (ord.order_items?.length || 1) - 1;

                  return (
                    <motion.div
                      key={ord.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setActiveOrder(ord)}
                      className="group cursor-pointer rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-soft transition hover:border-accent hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        {/* 1. Product Image Thumbnail */}
                        <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-cloud/50">
                          <img
                            src={firstItem?.product_image || '/assets/ub-logo-official.jpg'}
                            alt={firstItem?.product_name || ord.order_number}
                            className="h-full w-full object-cover object-center transition group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/ub-logo-official.jpg';
                            }}
                          />
                          {extraItemsCount > 0 && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">
                              +{extraItemsCount}
                            </span>
                          )}
                        </div>

                        {/* 2. Product Name & Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-sans text-sm sm:text-base font-bold text-ink truncate group-hover:text-accent transition">
                              {firstItem?.product_name || `Order ${ord.order_number}`}
                            </h3>
                            {/* 4. Status Badge */}
                            <div>{getStatusBadge(ord.status)}</div>
                          </div>

                          <p className="mt-1 text-xs text-muted">
                            Order <span className="font-mono font-bold text-ink">#{ord.order_number}</span> •{' '}
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            {/* 3. Product Price */}
                            <span className="font-mono text-base font-extrabold text-ink">
                              ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                              <span>View Details</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: FULL DETAILS OF SELECTED ORDER */
          <div>
            {/* Back Button to Master List */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-xs font-bold text-ink transition hover:border-accent hover:bg-accent-soft/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>← Back to Your Orders</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-accent">#{activeOrder.order_number}</span>
                {getStatusBadge(activeOrder.status)}
              </div>
            </div>

            <div className="space-y-6">
              {/* Order Overview Header Card */}
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-ink">
                      Order Details
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Placed on {new Date(activeOrder.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted">Grand Total</span>
                    <p className="font-mono text-2xl font-black text-accent">
                      ₹{Number(activeOrder.total_amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Live Stepper */}
                {activeOrder.status === 'Cancelled' ? (
                  <div className="my-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-500">
                    <XCircle className="h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Order Cancelled</h4>
                      <p className="text-xs mt-0.5 opacity-90">
                        {activeOrder.tracking_note || 'This order was cancelled. Please contact support if you need assistance.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                      Live Tracking Timeline
                    </h4>

                    <div className="relative">
                      {/* Stepper Progress Bar */}
                      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-line -z-0" />

                      <div className="space-y-5">
                        {ORDER_STEPS.map((step, idx) => {
                          const currentIdx = getStepIndex(activeOrder.status);
                          const isCompleted = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={step.status} className="relative flex items-start gap-4">
                              <div
                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                  isCompleted
                                    ? 'border-accent bg-accent text-accent-ink shadow-glow'
                                    : 'border-line bg-surface text-muted'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs font-mono font-bold">{idx + 1}</span>
                                )}
                              </div>

                              <div className="flex-1 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-bold ${
                                      isCurrent ? 'text-accent' : isCompleted ? 'text-ink' : 'text-muted'
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                  {isCurrent && (
                                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-black uppercase text-accent animate-pulse">
                                      Current Status
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted mt-0.5">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking Note (Courier Docket / Dispatch Updates) */}
                {activeOrder.tracking_note && (
                  <div className="rounded-2xl border border-line bg-cloud/50 p-4 text-xs">
                    <span className="font-bold text-ink">Courier / Tracking Details:</span>
                    <p className="mt-1 font-mono text-muted">{activeOrder.tracking_note}</p>
                  </div>
                )}
              </div>

              {/* Customer & Shipping Details Card (Full Customer Info) */}
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-soft">
                <h3 className="font-display text-base font-bold text-ink mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  <span>Customer & Shipping Details</span>
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs">
                  {/* Customer Information */}
                  <div className="space-y-3 rounded-2xl border border-line bg-cloud/30 p-4">
                    <span className="font-bold text-muted uppercase tracking-wider text-[10px]">
                      Customer Profile
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-ink">
                        <User className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="font-bold">{activeOrder.customer_name || profile?.full_name || 'Valued Customer'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted font-mono">
                        <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{activeOrder.customer_phone || profile?.phone || 'Mobile not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{user.email || profile?.email || 'Email not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Payment Information */}
                  <div className="space-y-3 rounded-2xl border border-line bg-cloud/30 p-4">
                    <span className="font-bold text-muted uppercase tracking-wider text-[10px]">
                      Delivery & Payment
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-ink">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">
                          {activeOrder.shipping_address || 'Address not provided'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-ink pt-1 border-t border-line">
                        <CreditCard className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="font-bold">{activeOrder.payment_method || 'Cash on Delivery (COD)'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Ordered Card */}
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-soft">
                <h3 className="font-display text-base font-bold text-ink mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-accent" />
                  <span>Itemized Order Summary</span>
                </h3>

                <div className="space-y-3">
                  {activeOrder.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-line bg-cloud/30 p-3.5"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-surface">
                          <img
                            src={item.product_image || '/assets/ub-logo-official.jpg'}
                            alt={item.product_name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/ub-logo-official.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-ink">{item.product_name}</p>
                          <p className="text-[11px] text-muted font-mono mt-0.5">
                            Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-ink">
                        ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="mt-5 border-t border-line pt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{Number(activeOrder.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping Fee</span>
                    <span className="font-mono font-bold text-[#1B8A5A] dark:text-[#8CE0B9]">
                      {activeOrder.shipping_fee === 0 ? 'FREE' : `₹${activeOrder.shipping_fee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-ink text-sm pt-2 border-t border-line">
                    <span>Total Amount</span>
                    <span className="font-mono text-base text-accent">
                      ₹{Number(activeOrder.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
