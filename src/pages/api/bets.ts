import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./_prisma";
import { HTTPError, handleHTTPError } from "./_error";
import { BetState, Bets, UserBetState, UserBetValue } from "@prisma/client";

export type GetBetDataResponse = {
    bet: Bets;
    bettors: Array<{
        state: UserBetState;
        value: UserBetValue;
    }>
}

export const getBet = async () => {
  const currentBet = await prisma.bets.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      bettors: {
        select: {
            value: true,
            state: true,
        }
      },
    }
  });

  if (!currentBet) {
    throw new HTTPError({ message: "no bet found", code: 404 });
  }

  const { bettors, ...bet } = currentBet;

  return { bet, bettors };
}

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = await getBet();
    return res.status(200).json(data);
  } catch (err) {
    handleHTTPError(res, err);
  }
}
