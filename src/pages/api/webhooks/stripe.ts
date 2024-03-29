import { stripe } from "@/utils/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { prisma } from "../_prisma";
import { UserBetTicketState } from "@prisma/client";

async function buffer(readable: Readable){
  const chunks = [];

  for await (const chunk of readable){
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'payment_intent.succeeded',
]);

const endpointSecret = process.env.STRIPE_WEBHOOK_SEC as string

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const buf = await buffer(request);
  const secret = request.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, secret, endpointSecret);
  } catch(err: any) {
    return response.status(400).send(`Webhook error: ${err.message}`);
  }

  const { type } = event;

  if(relevantEvents.has(type)){
    try {
      switch (type) {
        case 'payment_intent.succeeded':
          const checkoutSession = event.data.object;
          const customer = checkoutSession.customer?.toString();

          if (typeof customer === "string") {
            const user = await prisma.users.findFirst({
              where: {
                paymentClientId: customer,
              }
            });

            if (!user) return;

            const amount = (checkoutSession.amount_received / 100 / 5);

            const prismaInserts = Array(amount).fill(amount).map(() =>
                prisma.userBetTickets.create({
                    data: {
                        userId: user.id,
                        paymentId: checkoutSession.id,
                        state: UserBetTicketState.PAYED,
                    },
                })
            );

            await prisma.$transaction(prismaInserts);

            response.json({ ok: true });
          }

          break;
        default:
          throw new Error('Unhandled event.');
      }
    } catch (err) {
      return response.json({error: 'Webhook handler failed'});
    }
  }

  response.json({received: true});
}
