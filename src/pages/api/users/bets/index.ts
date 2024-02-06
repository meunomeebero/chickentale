import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../_prisma";
import { getUserByToken } from "../login";
import { HTTPError, handleHTTPError } from "../../_error";
import { createPaymentLink } from "@/utils/stripe";
import { BetState } from "@prisma/client";

type CreateBetParams = { token?: string, value: number, times: number };

export const getBet = async (token: string | undefined) => {
    const user = await getUserByToken(token);

    const bet = await prisma.bets.findFirst({
        where: {
            NOT: {
                state: BetState.FINISHED,
            }
        },
    });

    const myCurrentBets = await prisma.userBets.findMany({
        where: {
            betId: bet?.id ?? -1,
            userId: user.id,
            isPaymentConfirmed: true,
        }
    });

    const allMyBets = await prisma.userBets.findMany({
        where: {
            userId: user.id,
            isWithdrawn: false,
            isPaymentConfirmed: true,
        }
    });

    const myWinningBets = await prisma.$transaction(
        allMyBets.map(mb => 
            prisma.bets.findFirst({
                where: {
                    id: mb.betId,
                    state: BetState.FINISHED,
                    winner: mb.value,
                }
            })
        ),
    );

    const myMoney = myWinningBets.filter(Boolean).length

    return { myBets: myCurrentBets, myMoney };
}

export const createBet = async ({ token, value }: CreateBetParams) => {
    const user = await getUserByToken(token);

    const bet = await prisma.bets.findFirst({
        where: {
           NOT: {
            state: BetState.FINISHED,
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
