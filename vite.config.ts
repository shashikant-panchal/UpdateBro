import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function razorpayApiDevPlugin(env: Record<string, string>) {
  return {
    name: 'razorpay-api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // Expose env vars to process.env during local dev
        process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_U2XNwxcF1QgnvE';
        process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '2x5SoL3QUYbCPjWwWKXfJ4Fw';
        process.env.VITE_RAZORPAY_KEY_ID = env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_U2XNwxcF1QgnvE';

        const url = req.url?.split('?')[0];

        if (url === '/api/create-order' || url === '/api/verify-payment') {
          // Read request stream body
          const chunks: any[] = [];
          req.on('data', (chunk: any) => chunks.push(chunk));
          req.on('end', async () => {
            try {
              const rawBody = Buffer.concat(chunks).toString('utf-8');
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = {};
            }

            // Polyfill Express/Vercel helper methods on response
            res.status = function (code: number) {
              res.statusCode = code;
              return res;
            };
            res.json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              if (url === '/api/create-order') {
                const { default: handler } = await import('./api/create-order.js');
                await handler(req, res);
              } else if (url === '/api/verify-payment') {
                const { default: handler } = await import('./api/verify-payment.js');
                await handler(req, res);
              }
            } catch (err: any) {
              console.error(`Dev server API error at ${url}:`, err);
              res.status(500).json({ error: err.message || 'Internal Dev Server Error' });
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), razorpayApiDevPlugin(env)],
    base: '/',
    server: {
      port: 5173,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            framer: ['framer-motion'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  };
});
