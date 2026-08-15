import Stripe from 'stripe';

// Falls back to a placeholder so the module loads without throwing.
// Actual API calls will fail with an auth error until a real key is set.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-07-29.dahlia',
});
