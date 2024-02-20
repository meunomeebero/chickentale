import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByToken } from "../login";
import { handleHTTPError } from "../../_error";
import { createPaymentLink } from "@/utils/stripe";

type CreateTicketParams = { token?: string, quantity: number };

export const createTicket = async ({ token, quantity }: CreateTicketParams) => {
    const me = await getUserByToken(token);

    const paymentLink = await createPaymentLink(
        me,
        quantity
    );

    return { paymentLink };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    switch (req.method) {
        case "POST":
            const { quantity } = req.body;
            const bets = await createTicket({ token, quantity });
            return res.status(201).json(bets);
        default:
            res.status(405).json({ message: "method not allowed" });
            break
      }
  } catch (err) {
    handleHTTPError(res, err)
  }
}
