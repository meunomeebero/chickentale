import { stripe } from "@/utils/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { prisma } from "../_prisma";
import { BetState } from "@prisma/client";

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

const endpointSecret = "whsec_635e87d7bfa8f5deeee40be6a7de6cc5bd0b549716fa1738e8f4898e460ad4d0";

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

            const bet = await prisma.bets.findFirst({
              where: {
                 NOT: {
                  state: BetState.FINISHED,
                 }
              },
            });

            if (!bet) return;

            const myBet = await prisma.userBets.findFirst({
              where: {
                userId: user.id,
                betId: bet.id,
                isPaymentConfirmed: false, 
              },
            });

            if (!myBet) return;

            await prisma.userBets.update({
              where: {
                id: myBet.id,
              },
              data: {
                isPaymentConfirmed: true,
              }
            });
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