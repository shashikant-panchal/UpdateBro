/**
 * Razorpay Standard Web Checkout Integration Helper
 * UPDATE BRO® Official Store
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayCreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface RazorpaySuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResult {
  verified: boolean;
  message?: string;
  order_id?: string;
  payment_id?: string;
  error?: string;
}

/**
 * Dynamically ensures the Razorpay SDK script is loaded and ready.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Calls backend to initialize Razorpay order (Step 1)
 * @param amountInRupees Total amount in INR (e.g. 1499)
 * @param receipt Optional receipt identifier
 * @param notes Extra context notes for order tracking
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receipt?: string,
  notes?: Record<string, string>
): Promise<RazorpayCreateOrderResponse> {
  // Convert INR rupees to paise (minimum 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.order_id) {
    throw new Error(data.error || 'Failed to initialize Razorpay payment order');
  }

  return data as RazorpayCreateOrderResponse;
}

/**
 * Calls backend to verify Razorpay HMAC-SHA256 signature (Step 3)
 */
export async function verifyRazorpayPayment(
  payload: RazorpaySuccessPayload
): Promise<RazorpayVerificationResult> {
  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.verified) {
    return {
      verified: false,
      error: data.error || 'Payment signature verification failed',
    };
  }

  return data as RazorpayVerificationResult;
}

/**
 * Cleans up any stray Razorpay modal DOM elements and restores page scrolling.
 */
export function cleanupRazorpayDOMElements() {
  if (typeof document === 'undefined') return;
  try {
    const strayContainers = document.querySelectorAll('.razorpay-container, .razorpay-backdrop');
    strayContainers.forEach((el) => el.remove());
    document.body.style.overflow = '';
  } catch (err) {
    console.warn('Error cleaning up Razorpay elements:', err);
  }
}

export interface LaunchCheckoutOptions {
  orderData: RazorpayCreateOrderResponse;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  onSuccess: (payment: RazorpaySuccessPayload) => void;
  onError: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Opens the native Razorpay Standard modal (Step 2)
 */
export async function launchRazorpayModal({
  orderData,
  customerName,
  customerEmail,
  customerPhone,
  description = 'UPDATE BRO® Order Payment',
  onSuccess,
  onError,
  onDismiss,
}: LaunchCheckoutOptions) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    onError('Unable to load Razorpay payment gateway. Please check your internet connection.');
    return;
  }

  const key =
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    'rzp_live_U2o5Dfytop3zVB';

  const cleanPhone = (customerPhone || '').replace(/\D/g, '').slice(-10);

  const options: any = {
    key,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    name: 'UPDATE BRO®',
    description,
    order_id: orderData.order_id,
    prefill: {
      name: customerName,
      email: customerEmail || 'customer@updatebro.in',
      contact: cleanPhone ? `+91${cleanPhone}` : undefined,
    },
    theme: {
      color: '#F59E0B', // Cyber Amber / Flagship Accent
    },
    modal: {
      ondismiss: () => {
        cleanupRazorpayDOMElements();
        if (onDismiss) onDismiss();
      },
      escape: true,
      backdropclose: false,
    },
    handler: (response: RazorpaySuccessPayload) => {
      cleanupRazorpayDOMElements();
      onSuccess(response);
    },
  };

  try {
    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      cleanupRazorpayDOMElements();
      const reason = response.error?.description || response.error?.reason || 'Payment failed';
      onError(`Payment could not be completed: ${reason}`);
    });

    rzp.open();
  } catch (err: any) {
    cleanupRazorpayDOMElements();
    console.error('Error opening Razorpay modal:', err);
    onError(err.message || 'Failed to open Razorpay payment window');
  }
}
