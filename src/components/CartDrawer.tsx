import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
  User,
  MapPin,
  Lock,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  useCart,
  VALID_COUPON,
} from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStorefront } from '../context/StorefrontContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { OrderRecord } from '../types';
import { ProductArt } from './ProductArt';

type CheckoutStep = 'bag' | 'auth' | 'address' | 'payment' | 'confirmed';

interface CartDrawerProps {
  onOpenOrders?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenOrders }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    addToCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingProgress,
    amountToFreeShipping,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    recordOrder,
  } = useCart();

  const { user, profile, signInWithGoogle, updateProfile, refreshProfile } = useAuth();
  const { products } = useStorefront();

  const [step, setStep] = useState<CheckoutStep>('bag');
  const [couponInput, setCouponInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const paymentMethod = 'Cash on Delivery (COD)';
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Resume checkout after Google OAuth redirect
  useEffect(() => {
    if (!user) return;
    try {
      const wasPending = sessionStorage.getItem('ub_pending_checkout');
      if (wasPending === 'true') {
        sessionStorage.removeItem('ub_pending_checkout');
        const savedName = sessionStorage.getItem('ub_pending_name');
        const savedPhone = sessionStorage.getItem('ub_pending_phone');
        const savedAddress = sessionStorage.getItem('ub_pending_address');
        const savedCity = sessionStorage.getItem('ub_pending_city');
        const savedPincode = sessionStorage.getItem('ub_pending_pincode');

        if (savedName && !customerName) setCustomerName(savedName);
        if (savedPhone && !phone) setPhone(savedPhone);
        if (savedAddress && !address) setAddress(savedAddress);
        if (savedCity && !city) setCity(savedCity);
        if (savedPincode && !pincode) setPincode(savedPincode);

        // Clean up temporary pending storage
        sessionStorage.removeItem('ub_pending_name');
        sessionStorage.removeItem('ub_pending_phone');
        sessionStorage.removeItem('ub_pending_address');
        sessionStorage.removeItem('ub_pending_city');
        sessionStorage.removeItem('ub_pending_pincode');

        // Automatically open cart drawer and guide user to address & contact step
        setIsCartOpen(true);
        setStep('address');
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Pre-fill fields from profile when user or profile is available
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !customerName) {
        setCustomerName(profile.full_name);
      }
      if (profile.phone && !phone) {
        setPhone(profile.phone.replace(/^\+91\s*/, ''));
      }
      if (profile.shipping_address && !address) {
        // Attempt to parse standard formatted "street, city - pincode"
        const match = profile.shipping_address.match(/^(.*),\s*([^-]+)\s*-\s*(\d{6})$/);
        if (match) {
          setAddress(match[1].trim());
          if (!city) setCity(match[2].trim());
          if (!pincode) setPincode(match[3].trim());
        } else {
          setAddress(profile.shipping_address);
        }
      }
    } else if (user) {
      if (!customerName) {
        const fallbackName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split('@')[0] : '');
        setCustomerName(fallbackName);
      }
    }
  }, [profile, user]);

  // If user signs in while on 'auth' step, automatically advance to address
  useEffect(() => {
    if (user && step === 'auth') {
      const cleanPhone = (phone || profile?.phone || '').replace(/\D/g, '');
      const currentAddress = (address || profile?.shipping_address || '').trim();

      if (cleanPhone.length >= 10 && currentAddress.length >= 6) {
        setStep('payment');
      } else {
        setStep('address');
      }
    }
  }, [user, step, profile, phone, address]);

  // Resume checkout flow seamlessly after Google OAuth redirect
  useEffect(() => {
    try {
      const isPending = sessionStorage.getItem('ub_pending_checkout');
      if (isPending === 'true' && user) {
        sessionStorage.removeItem('ub_pending_checkout');
        const savedName = sessionStorage.getItem('ub_pending_name');
        const savedPhone = sessionStorage.getItem('ub_pending_phone');
        const savedAddress = sessionStorage.getItem('ub_pending_address');
        const savedCity = sessionStorage.getItem('ub_pending_city');
        const savedPincode = sessionStorage.getItem('ub_pending_pincode');

        if (savedName) setCustomerName(savedName);
        if (savedPhone) setPhone(savedPhone);
        if (savedAddress) setAddress(savedAddress);
        if (savedCity) setCity(savedCity);
        if (savedPincode) setPincode(savedPincode);

        // Open cart drawer and proceed directly to address step
        setIsCartOpen(true);
        setStep('address');
      }
    } catch {
      // Ignore session storage errors
    }
  }, [user, setIsCartOpen]);

  // Ensure cart view is fresh and ready if opened after previous order
  useEffect(() => {
    if (isCartOpen && items.length > 0 && step === 'confirmed') {
      setStep('bag');
      setPlacedOrder(null);
    }
  }, [isCartOpen, items.length, step]);

  const handleClose = () => {
    setIsCartOpen(false);
    setPlacedOrder(null);
    setStep('bag');
  };

  // Lock body scroll and listen for Escape key when cart is open
  useEffect(() => {
    if (!isCartOpen) {
      document.body.style.overflow = '';
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const handleProceedFromBag = () => {
    if (!user) {
      setStep('auth');
      return;
    }

    const cleanPhone = (phone || profile?.phone || '').replace(/\D/g, '');
    const currentAddress = (address || profile?.shipping_address || '').trim();

    if (cleanPhone.length < 10 || currentAddress.length < 6) {
      setStep('address');
    } else {
      setStep('payment');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsAuthenticating(true);
      setAuthError(null);
      try {
        sessionStorage.setItem('ub_pending_checkout', 'true');
        if (customerName) sessionStorage.setItem('ub_pending_name', customerName);
        if (phone) sessionStorage.setItem('ub_pending_phone', phone);
        if (address) sessionStorage.setItem('ub_pending_address', address);
        if (city) sessionStorage.setItem('ub_pending_city', city);
        if (pincode) sessionStorage.setItem('ub_pending_pincode', pincode);
      } catch {
        // Ignore session storage errors
      }
      await signInWithGoogle();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Google sign-in encountered an error.');
      setIsAuthenticating(false);
    }
  };

  const handleSaveAddressAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (!customerName.trim()) {
      setAddressError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setAddressError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!address.trim() || address.trim().length < 6) {
      setAddressError('Please enter your complete street address (House/Flat, Street, Landmark).');
      return;
    }
    if (!city.trim()) {
      setAddressError('Please enter your city.');
      return;
    }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setAddressError('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    const finalPhone = `+91 ${cleanPhone.slice(-10)}`;
    const fullAddress = `${address.trim()}, ${city.trim()} - ${pincode.trim()}`;

    // Persist immediately to Supabase backend in profiles table
    if (user && isSupabaseConfigured) {
      try {
        setIsSavingAddress(true);
        await updateProfile({
          full_name: customerName.trim(),
          phone: finalPhone,
          shipping_address: fullAddress,
        });
        await refreshProfile();
      } catch (err) {
        console.warn('Failed to save user profile in Supabase:', err);
      } finally {
        setIsSavingAddress(false);
      }
    }

    setStep('payment');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setStep('auth');
      return;
    }

    const cleanPhone = (phone || profile?.phone || '').replace(/\D/g, '');
    const currentAddress = (address || profile?.shipping_address || '').trim();

    if (cleanPhone.length < 10 || currentAddress.length < 6) {
      setStep('address');
      return;
    }

    const finalName = customerName.trim() || profile?.full_name || 'UB Customer';
    const finalCity = city.trim() || 'Hyderabad';
    const finalPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : `+91 ${cleanPhone.slice(-10)}`;
    const fullAddress = address.includes('-')
      ? address.trim()
      : `${address.trim()}, ${finalCity} - ${pincode.trim() || '500001'}`;
    const orderNumber = `UB-${Math.floor(1000 + Math.random() * 9000)}`;

    // Sync to Supabase in background / real-time
    if (isSupabaseConfigured) {
      try {
        const { data: createdOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: user?.id || null,
            customer_name: finalName,
            customer_phone: finalPhone,
            shipping_address: fullAddress,
            payment_method: paymentMethod,
            subtotal,
            shipping_fee: shippingFee,
            total_amount: total,
            status: 'Pending',
          })
          .select('id, order_number')
          .single();

        if (createdOrder && !orderErr) {
          const orderItemsPayload = items.map((item) => ({
            order_id: createdOrder.id,
            product_name: `${item.name} (${item.color.name})`,
            product_image: item.image || null,
            quantity: item.quantity,
            unit_price: item.price,
          }));

          await supabase.from('order_items').insert(orderItemsPayload);
        }
      } catch (err) {
        console.warn('Supabase checkout sync failed:', err);
      }
    }

    const order = recordOrder({
      customerName: finalName,
      customerPhone: finalPhone,
      customerEmail: user?.email || profile?.email || undefined,
      shippingAddress: fullAddress,
      city: finalCity,
      paymentMethod,
      total,
      itemsCount: items.reduce((s, i) => s + i.quantity, 0),
    });
    setPlacedOrder(order);
    setStep('confirmed');
  };

  const quickRecs = products.slice(0, 3);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          key="cart-drawer-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div
            onClick={handleClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <motion.aside
            key="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-line bg-canvas shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-4">
              <div className="flex items-center gap-2.5">
                {step !== 'bag' && step !== 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 'payment') setStep('address');
                      else setStep('bag');
                    }}
                    className="rounded-btn p-1.5 text-muted hover:bg-cloud hover:text-ink transition"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="font-display text-lg font-bold text-ink">
                  {step === 'bag'
                    ? 'Your UB Bag'
                    : step === 'auth'
                    ? 'Sign In to Order'
                    : step === 'address'
                    ? 'Shipping & Contact'
                    : step === 'payment'
                    ? 'Payment & Confirm'
                    : 'Order Confirmed'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-btn p-2 text-muted transition hover:bg-cloud hover:text-ink"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            {step === 'bag' && items.length > 0 && (
              <div className="border-b border-line bg-accent-soft px-5 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Truck className="h-4 w-4 shrink-0 text-ink" />
                  {amountToFreeShipping === 0 ? (
                    <span>🎉 You unlocked FREE Express Shipping!</span>
                  ) : (
                    <span>
                      Add{' '}
                      <span className="font-mono font-bold">
                        ₹{amountToFreeShipping.toLocaleString('en-IN')}
                      </span>{' '}
                      more for FREE Express Shipping (₹{FREE_SHIPPING_THRESHOLD}+)
                    </span>
                  )}
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </div>
            )}

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* STEP 1: BAG */}
              {step === 'bag' && (
                <>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-ink">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                      <p className="mt-4 font-display text-lg font-bold text-ink">
                        Your bag feels too light
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Add UB gear below to unlock Free Express Shipping above ₹499.
                      </p>

                      {quickRecs.length > 0 && (
                        <div className="mt-7 w-full space-y-2.5 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                            Popular Quick Adds
                          </p>
                          {quickRecs.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 rounded-card border border-line bg-surface p-2.5"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cloud">
                                <ProductArt
                                  model={p.hardwareModel}
                                  color={p.colors[0]}
                                  image={p.image}
                                  alt={p.name}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-ink">{p.name}</p>
                                <p className="font-mono text-xs font-semibold text-muted">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => addToCart(p, p.colors[0], 1, false)}
                                className="rounded-btn bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink hover:bg-accent-hover"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <motion.div
                          layout
                          key={item.key}
                          className="flex items-center gap-3.5 rounded-card border border-line bg-surface p-3 shadow-sm"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cloud">
                            <ProductArt
                              model={item.hardwareModel}
                              color={item.color}
                              image={item.image}
                              alt={item.name}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">{item.name}</p>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-black/15"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span>{item.color.name}</span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="font-mono text-sm font-extrabold text-ink">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>

                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-btn border border-line bg-cloud">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.key, -1)}
                                    className="flex h-7 w-7 items-center justify-center text-ink hover:bg-surface"
                                    aria-label="Decrease"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-6 text-center font-mono text-xs font-bold text-ink">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.key, 1)}
                                    className="flex h-7 w-7 items-center justify-center text-ink hover:bg-surface"
                                    aria-label="Increase"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.key)}
                                  className="p-1 text-muted hover:text-[#D44E34]"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Coupon Section */}
                      <div className="mt-4 rounded-card border border-line bg-surface p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
                            <Tag className="h-3.5 w-3.5 text-accent" /> Promo Code
                          </span>
                          {!couponCode && (
                            <button
                              type="button"
                              onClick={() => applyCoupon(VALID_COUPON)}
                              className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink hover:bg-accent hover:text-accent-ink"
                            >
                              Tap to Apply {VALID_COUPON} (10% OFF)
                            </button>
                          )}
                        </div>

                        {couponCode ? (
                          <div className="mt-2.5 flex items-center justify-between rounded-btn border border-accent bg-accent-soft px-3 py-2 text-xs">
                            <span className="font-bold text-ink">
                              ✨ <span className="font-mono">{couponCode}</span> applied (-₹
                              {discountAmount.toLocaleString('en-IN')})
                            </span>
                            <button
                              type="button"
                              onClick={removeCoupon}
                              className="font-bold text-muted underline hover:text-ink"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyCoupon} className="mt-2.5 flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder="Enter UPDATE10"
                              className="h-9 flex-1 rounded-btn border border-line bg-cloud px-3 font-mono text-xs uppercase text-ink placeholder:normal-case placeholder:text-muted focus:border-accent focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="h-9 rounded-btn bg-ink px-3.5 text-xs font-bold text-canvas dark:bg-accent dark:text-accent-ink"
                            >
                              Apply
                            </button>
                          </form>
                        )}
                        {couponError && (
                          <p className="mt-1.5 text-[11px] font-medium text-[#D44E34]">
                            {couponError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: GOOGLE AUTHENTICATION GATE */}
              {step === 'auth' && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Lock className="h-8 w-8 text-accent" />
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                    Sign In to Checkout
                  </h3>
                  <p className="mt-1.5 text-xs text-muted max-w-xs">
                    Sign in securely with Google to link this order, track live dispatch, and save your delivery preferences.
                  </p>

                  {authError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500 text-left">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="mt-8 w-full space-y-3">
                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isAuthenticating}
                      className="group relative flex h-13 w-full items-center justify-center gap-3 rounded-2xl border-2 border-line bg-surface p-3.5 font-sans font-bold text-ink shadow-sm transition hover:border-[#4285F4] hover:shadow-md disabled:opacity-50"
                    >
                      {/* Google G Logo SVG */}
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
                      <span className="text-sm">
                        {isAuthenticating ? 'Redirecting to Google...' : 'Continue with Google'}
                      </span>
                    </button>

                    <div className="pt-2 text-center space-y-1">
                      <p className="text-[11px] text-muted">
                        🔒 256-bit Encrypted • Free Express Delivery on ₹499+
                      </p>
                      <p className="text-[10px] text-muted leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a
                          href="/terms-of-service"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-accent underline hover:text-accent-hover"
                        >
                          Terms
                        </a>{' '}
                        &amp;{' '}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-accent underline hover:text-accent-hover"
                        >
                          Privacy Policy
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MANDATORY PHONE NUMBER & DELIVERY ADDRESS */}
              {step === 'address' && (
                <form id="address-form" onSubmit={handleSaveAddressAndContinue} className="space-y-4">
                  {/* Account Badge */}
                  <div className="flex items-center gap-2 rounded-xl bg-accent-soft border border-accent/20 p-2.5 text-xs">
                    <User className="h-4 w-4 shrink-0 text-accent" />
                    <span className="truncate text-ink">
                      Signed in as <strong className="font-bold">{user?.email || profile?.full_name || 'UB Customer'}</strong>
                    </span>
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-3 text-xs text-muted">
                    <p className="font-bold text-ink">Carrier Delivery Notice:</p>
                    <p className="mt-0.5">
                      Your mobile number and street address are strictly required to dispatch your order and send WhatsApp / SMS delivery alerts.
                    </p>
                  </div>

                  {addressError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{addressError}</span>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="h-10 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-btn border border-line bg-surface focus-within:border-accent">
                      <span className="border-r border-line px-3 text-xs font-bold text-muted">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="h-10 w-full bg-transparent px-3 font-mono text-sm text-ink focus:outline-none"
                      />
                    </div>
                    <span className="mt-1 block text-[10px] text-muted">
                      Required for courier dispatch updates and delivery coordination.
                    </span>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">
                      Street Address &amp; House/Flat No. <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat 302, Green Valley Apts, Road No. 12, Banjara Hills"
                      className="w-full rounded-btn border border-line bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink">
                        City / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hyderabad"
                        className="h-10 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="500034"
                        className="h-10 w-full rounded-btn border border-line bg-surface px-3 font-mono text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 4: PAYMENT SELECTION */}
              {step === 'payment' && (
                <form id="payment-form" onSubmit={handleConfirmOrder} className="space-y-4">
                  {/* Delivery Address Summary Card */}
                  <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-line pb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>Deliver To</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('address')}
                        className="text-xs font-bold text-accent hover:underline"
                      >
                        Edit Details
                      </button>
                    </div>
                    <div className="mt-2.5 text-xs space-y-1">
                      <p className="font-bold text-ink">{customerName}</p>
                      <p className="font-mono text-muted">
                        <span className="inline-flex items-center gap-1 font-bold text-[#1B8A5A] dark:text-[#8CE0B9]">
                          <Check className="h-3 w-3" /> +91 {phone.replace(/\D/g, '').slice(-10)}
                        </span>
                      </p>
                      <p className="text-muted leading-relaxed">
                        {address}, {city} - {pincode}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-ink pt-1">
                    Payment Method:
                  </p>

                  <div className="rounded-2xl border-2 border-accent bg-accent-soft/30 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink mt-0.5">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">Cash on Delivery (COD)</span>
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-extrabold text-accent">
                            ZERO EXTRA FEE
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted leading-relaxed">
                          Pay comfortably with cash or UPI scan upon package delivery at your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 5: ORDER CONFIRMED */}
              {step === 'confirmed' && placedOrder && (
                <div className="flex flex-col items-center py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink shadow-glow"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                    Order Confirmed!
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Thank you, {placedOrder.customerName}! Your UPDATE BRO® order has been placed.
                  </p>

                  <div className="mt-6 w-full space-y-3 rounded-2xl border border-line bg-surface p-4 text-left text-xs">
                    <div className="flex justify-between border-b border-line pb-2">
                      <span className="text-muted">Order ID</span>
                      <span className="font-mono font-extrabold text-accent">
                        {placedOrder.orderId}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-ink">Customer & Delivery Info</span>
                      <p className="font-semibold text-ink">{placedOrder.customerName}</p>
                      {placedOrder.customerPhone && (
                        <p className="font-mono text-muted">{placedOrder.customerPhone}</p>
                      )}
                      {placedOrder.customerEmail && (
                        <p className="text-muted">{placedOrder.customerEmail}</p>
                      )}
                      {placedOrder.shippingAddress && (
                        <p className="text-muted leading-relaxed mt-1">
                          {placedOrder.shippingAddress}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-line pt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted">Payment</span>
                        <span className="font-semibold text-ink">{placedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Total Due</span>
                        <span className="font-mono font-bold text-ink">
                          ₹{placedOrder.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Status</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#1B8A5A] dark:text-[#8CE0B9]">
                          <Sparkles className="h-3 w-3" /> {placedOrder.eta}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 w-full space-y-2">
                    {onOpenOrders && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onOpenOrders();
                        }}
                        className="w-full rounded-2xl bg-accent py-3 text-xs font-bold text-accent-ink shadow-glow transition hover:bg-accent-hover"
                      >
                        Track in Your Orders →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full rounded-2xl border border-line py-2.5 text-xs font-bold text-muted transition hover:text-ink"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Totals & CTA */}
            {step === 'bag' && items.length > 0 && (
              <div className="border-t border-line bg-surface p-5">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-ink">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#1B8A5A] dark:text-[#8CE0B9]">
                      <span>Coupon ({couponCode})</span>
                      <span className="font-mono font-bold">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Express Shipping</span>
                    <span className="font-mono font-semibold text-ink">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-2 text-base font-extrabold text-ink">
                    <span>Total</span>
                    <span className="font-mono">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedFromBag}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent text-sm font-bold text-accent-ink shadow-glow transition hover:bg-accent-hover"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 'address' && (
              <div className="border-t border-line bg-surface p-5">
                <button
                  type="submit"
                  form="address-form"
                  disabled={isSavingAddress}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent text-sm font-bold text-accent-ink shadow-glow hover:bg-accent-hover disabled:opacity-50"
                >
                  <span>{isSavingAddress ? 'Saving Details...' : 'Save & Continue to Payment'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="border-t border-line bg-surface p-5">
                <button
                  type="submit"
                  form="payment-form"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-ink text-sm font-bold text-canvas transition hover:opacity-90 dark:bg-accent dark:text-accent-ink"
                >
                  <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
                </button>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="border-t border-line bg-surface p-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-11 w-full items-center justify-center rounded-btn bg-accent text-sm font-bold text-accent-ink hover:bg-accent-hover"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
