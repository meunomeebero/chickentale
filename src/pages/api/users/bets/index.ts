import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../_prisma";
import { getUserByToken } from "../login";
import { HTTPError, handleHTTPError } from "../../_error";
import { createPaymentLink } from "@/utils/stripe";
import { BetState } from "@prisma/client";

type CreateBetParams = { token?: string, value: number, times: number };

export const getBet = async (token: string | undefined) => {
    const me = await getUserByToken(token);

    const myBets = await prisma.userBets.findMany({
        where: {
            userId: me.id,
        }
    })
    return { myBets };
}

export const createBet = async ({ token, value }: CreateBetParams) => {
    const user = await getUserByToken(token);

    const bet = await prisma.bets.findFirst({
        where: {
           NOT: {
            state: BetState.CLOSE,
           }
        },
    });

    if (!bet) {
        throw new HTTPError({ message: "bet not found", code: 404 });
    }

    await prisma.userBets.create({
        data: {
            betId: bet.id,
            userId: user.id,
            value,
        },
    });

    const paymentLink = await createPaymentLink(
        user,
        JSON.stringify({ value, times: 1, token })
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
        case "GET":
            const data = await getBet(token)
            return res.status(200).json(data);
        case "POST":
            const { value, times } = req.body;
            const bets = await createBet({ token, times, value });
            return res.status(201).json(bets);
        default:
            res.status(405).json({ message: "method not allowed" });
            break
      }
  } catch (err) {
    handleHTTPError(res, err)
  }
}
