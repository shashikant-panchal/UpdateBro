import Razorpay from 'razorpay';

/**
 * Vercel Serverless Function: POST /api/create-order
 * Creates a Razorpay Order with specified amount (in paise), currency, and receipt.
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const DEFAULT_KEY_ID = 'rzp_live_U2o5Dfytop3zVB';
  const DEFAULT_KEY_SECRET = 'Y9NNTp1ontPAHkz3Hs7BiTJn';

  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.VITE_RAZORPAY_KEY_ID ||
    DEFAULT_KEY_ID;
  const key_secret =
    process.env.RAZORPAY_KEY_SECRET ||
    DEFAULT_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error('Razorpay credentials missing from server environment');
    return res.status(401).json({
      error: 'Razorpay API keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { amount, currency = 'INR', receipt, notes = {} } = body;

    const parsedAmount = Number(amount);
    // Minimum amount: 100 paise (₹1.00)
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        error: 'Invalid order amount. Amount must be at least 100 paise (₹1.00).',
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const orderOptions = {
      amount: Math.round(parsedAmount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt || `ub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        store: 'UPDATE BRO Official Store',
        ...notes,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create order with Razorpay',
    });
  }
}
