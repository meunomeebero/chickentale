import { Users } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(
    process.env.STRIPE_SK as string,
    { apiVersion: '2023-10-16' }
    );

export const createPaymentLink = async (user: Users, data: string) => {
    const paymentLink = await stripe.checkout.sessions.create({
        customer: user.paymentClientId as string,
        metadata: {
            email: user.email,
        },
        line_items: [
            {
                price: process.env.STRIPE_PRODUCT_ID,
                quantity: 1,
            },
        ],
        payment_method_types: [
            'card',
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}?eventData=${data}`,
    });
    
    return paymentLink.url;
}

export { stripe };