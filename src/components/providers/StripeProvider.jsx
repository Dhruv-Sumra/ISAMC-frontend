import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  // eslint-disable-next-line no-console
  console.error('Stripe publishable key is missing! Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.');
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const StripeProvider = ({ children }) => {
  if (!stripeKey) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl m-8">
        <h2 className="text-2xl font-bold mb-2">Stripe Key Missing</h2>
        <p>Please set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your <code>.env</code> file and restart the dev server.</p>
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
