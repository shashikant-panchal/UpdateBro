import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, ColorVariant, OrderRecord, Product } from '../types';

export const FREE_SHIPPING_THRESHOLD = 499;
export const EXPRESS_SHIPPING_FEE = 49;
export const VALID_COUPON = 'UPDATE10';

interface CartContextValue {
  items: CartItem[];
  couponCode: string | null;
  couponError: string | null;
  isCartOpen: boolean;
  lastAddedTick: number;
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingProgress: number;
  amountToFreeShipping: number;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (product: Product, color: ColorVariant, qty?: number, openDrawer?: boolean) => void;
  updateQuantity: (key: string, delta: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  recordOrder: (order: Omit<OrderRecord, 'orderId' | 'createdAt' | 'status' | 'eta'>) => OrderRecord;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = 'ub-cart-items-v1';
const COUPON_KEY = 'ub-coupon-v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(COUPON_KEY);
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedTick, setLastAddedTick] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      if (couponCode) localStorage.setItem(COUPON_KEY, couponCode);
      else localStorage.removeItem(COUPON_KEY);
    } catch {
      // ignore
    }
  }, [couponCode]);

  const addToCart = (product: Product, color: ColorVariant, qty = 1, openDrawer = false) => {
    const key = `${product.id}:${color.id}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: Math.min(10, item.quantity + qty) } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          hardwareModel: product.hardwareModel,
          image: product.image,
          color,
          quantity: qty,
          highlightBar: product.highlightBar,
        },
      ];
    });
    setLastAddedTick((t) => t + 1);
    if (openDrawer) setIsCartOpen(true);
  };

  const updateQuantity = (key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setCouponError(null);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setCouponError('Enter a promo code to apply.');
      return false;
    }
    if (normalized === VALID_COUPON) {
      setCouponCode(VALID_COUPON);
      setCouponError(null);
      return true;
    }
    setCouponError('Invalid code. Try UPDATE10 for 10% OFF!');
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponError(null);
  };

  const recordOrder = (order: Omit<OrderRecord, 'orderId' | 'createdAt' | 'status' | 'eta'>) => {
    const num = Math.floor(100000 + Math.random() * 899999);
    const created: OrderRecord = {
      ...order,
      orderId: `UB-${num}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      eta: 'Dispatches within 4 hours via UB Express',
    };
    clearCart();
    return created;
  };

  const summary = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const mrpTotal = items.reduce((sum, i) => sum + i.mrp * i.quantity, 0);
    const discountAmount = couponCode === VALID_COUPON ? Math.round(subtotal * 0.1) : 0;
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const shippingFee =
      afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : EXPRESS_SHIPPING_FEE;
    const total = afterDiscount + shippingFee;
    const freeShippingProgress = Math.min(
      100,
      Math.round((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
    );
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

    return {
      itemCount,
      subtotal,
      mrpTotal,
      discountAmount,
      shippingFee,
      total,
      freeShippingProgress,
      amountToFreeShipping,
    };
  }, [items, couponCode]);

  return (
    <CartContext.Provider
      value={{
        items,
        couponCode,
        couponError,
        isCartOpen,
        lastAddedTick,
        ...summary,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        recordOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
