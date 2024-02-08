import { NextApiRequest, NextApiResponse } from "next";
import { getUserByToken } from "../login";
import { handleHTTPError } from "../../_error";
import { prisma } from "../../_prisma";
import { Bets, UserBets } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const me = await getUserByToken(token);

        const allMyBets = await prisma.userBets.findMany({
            where: {
                userId: me.id,
                isPaymentConfirmed: true,
                isWithdrawn: false,
            },
            select: {
                betId: true,
                value: true,
            }
        });

        const allMyWinningBets = await prisma.$transaction(
            allMyBets.map(mb =>
                prisma.bets.findFirst({
                    where: {
                        id: mb.betId,
                        winner: mb.value,
                    },
                    include: {
                        bettors: true,
                    }
                })
            ),
        );

        const myWinningBets = allMyWinningBets.filter(Boolean) as Array<Bets & { bettors: UserBets[] }>;

        const data = myWinningBets.reduce((result, bet) => {
            const { winners, losers } = bet.bettors.reduce((a, b) => {
                if (b.value === bet.winner && b.isPaymentConfirmed) {
                    a.winners++
                    return a;
                }

                if (b.value !== bet.winner && b.isPaymentConfirmed) {
                    a.losers++
                    return a;
                }

                return a;
            }, { winners: 0, losers: 0 })

            result.winners += winners;
            result.losers += losers;

            return result;
        }, { winners: 0, losers: 0 })


        const myMoneeeey = ((data.losers * 5) / data.winners) + allMyWinningBets.length * 5;

        return res.json(myMoneeeey);
    } catch (err) {
        handleHTTPError(res, err)
    }
}
