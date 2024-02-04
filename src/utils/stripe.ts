import Stripe from 'stripe';

const stripe = new Stripe(
    process.env.STRIPE_SK as string,
    { apiVersion: '2023-10-16' }
    );

export { stripe };