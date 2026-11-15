import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  useCart,
  VALID_COUPON,
} from '../context/CartContext';
import { PRODUCTS } from '../data/catalog';
import type { OrderRecord } from '../types';
import { ProductArt } from './ProductArt';

type CheckoutStep = 'bag' | 'address' | 'payment' | 'confirmed';

export const CartDrawer: React.FC = () => {
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

  const [step, setStep] = useState<CheckoutStep>('bag');
  const [couponInput, setCouponInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant (GPay / PhonePe)');
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === 'confirmed') {
      window.setTimeout(() => setStep('bag'), 300);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = recordOrder({
      customerName: customerName.trim() || 'Guest Bro',
      city: city.trim() || 'Bengaluru',
      paymentMethod,
      total,
      itemsCount: items.reduce((s, i) => s + i.quantity, 0),
    });
    setPlacedOrder(order);
    setStep('confirmed');
  };

  const quickRecs = PRODUCTS.slice(0, 3);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          <motion.aside
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
                    onClick={() => setStep(step === 'payment' ? 'address' : 'bag')}
                    className="rounded-btn p-1.5 text-muted hover:bg-cloud hover:text-ink"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="font-display text-lg font-bold text-ink">
                  {step === 'bag'
                    ? 'Your UB Bag'
                    : step === 'address'
                    ? 'Shipping Details'
                    : step === 'payment'
                    ? 'Select Payment'
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

              {step === 'address' && (
                <form
                  id="address-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep('payment');
                  }}
                  className="space-y-3.5"
                >
                  <p className="text-xs text-muted">
                    Orders placed before 4 PM ship same day via UPDATE BRO Express.
                  </p>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Rohan Kapoor"
                      className="h-10 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-10 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink">Street Address</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat 402, Indiranagar 100ft Rd"
                      className="w-full rounded-btn border border-line bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="h-10 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-ink">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560038"
                        className="h-10 w-full rounded-btn border border-line bg-surface px-3 font-mono text-sm text-ink focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {step === 'payment' && (
                <form id="payment-form" onSubmit={handleConfirmOrder} className="space-y-3">
                  <p className="text-xs text-muted">
                    Choose a secure payment option. Total payable:{' '}
                    <span className="font-mono font-bold text-ink">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </p>
                  {[
                    'UPI Instant (GPay / PhonePe)',
                    'Credit / Debit Card (Visa / RuPay)',
                    'Cash on Delivery (Zero Extra Fee)',
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-card border p-3.5 transition ${
                        paymentMethod === opt
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-surface hover:border-accent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === opt}
                        onChange={() => setPaymentMethod(opt)}
                        className="accent-ink"
                      />
                      <CreditCard className="h-4 w-4 text-ink" />
                      <span className="text-xs font-bold text-ink">{opt}</span>
                    </label>
                  ))}

                  <div className="rounded-card border border-line bg-surface p-3.5 text-xs">
                    <p className="font-bold text-ink">Delivering To:</p>
                    <p className="mt-0.5 text-muted">
                      {customerName}, {address}, {city} - {pincode}
                    </p>
                  </div>
                </form>
              )}

              {step === 'confirmed' && placedOrder && (
                <div className="flex flex-col items-center py-8 text-center">
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
                    Thank you, {placedOrder.customerName}! Your UPDATE BRO® gear is queued for
                    dispatch.
                  </p>

                  <div className="mt-6 w-full space-y-2 rounded-card border border-line bg-surface p-4 text-left text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Order ID</span>
                      <span className="font-mono font-extrabold text-ink">
                        {placedOrder.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Payment</span>
                      <span className="font-semibold text-ink">{placedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Total Paid</span>
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
                  onClick={() => setStep('address')}
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
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent text-sm font-bold text-accent-ink shadow-glow hover:bg-accent-hover"
                >
                  <span>Continue to Payment</span>
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
        </div>
      )}
    </AnimatePresence>
  );
};
