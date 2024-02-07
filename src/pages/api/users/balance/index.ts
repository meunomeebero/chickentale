import { NextApiRequest, NextApiResponse } from "next";
import { getUserByToken } from "../login";
import { handleHTTPError } from "../../_error";
import { prisma } from "../../_prisma";
import { BetState } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const me = await getUserByToken(token);

        const allFinishedBets = await prisma.bets.findMany({
            where: {
                state: BetState.FINISHED,
            }
        });

        const allMyWinningBets = await prisma.$transaction(
            allFinishedBets.map(fb =>
                prisma.userBets.findMany({
                    where: [

                    ]
                }),
            )
        )


    } catch (err) {
        handleHTTPError(res, err)
    }
}
