import crypto from 'crypto';

/**
 * Vercel Serverless Function: POST /api/verify-payment
 * Verifies Razorpay payment signature using HMAC-SHA256 algorithm.
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

  const DEFAULT_KEY_SECRET = 'Y9NNTp1ontPAHkz3Hs7BiTJn';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET;

  if (!key_secret) {
    console.error('RAZORPAY_KEY_SECRET not set in server environment');
    return res.status(401).json({
      error: 'Razorpay secret key not configured on server',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required verification fields: razorpay_order_id, razorpay_payment_id, razorpay_signature',
      });
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(payload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(generatedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf-8');

    const isValid =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    if (!isValid) {
      console.warn(`Payment signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature. Payment verification failed.',
      });
    }

    return res.status(200).json({
      verified: true,
      message: 'Payment signature verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    return res.status(500).json({
      verified: false,
      error: error.message || 'Server error during payment verification',
    });
  }
}
