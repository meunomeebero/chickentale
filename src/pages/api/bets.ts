import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./_prisma";

export const getBet = async  () => {
  const bet = await prisma.bets.findFirst();

  if (!bet) {
    return {};
  }

  const userBets = await prisma.userBets.findMany({
    where: {
      betId: bet?.id,
    }
  })

  return { bet, userBets };
}

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  const data = getBet();

  return res.status(200).json(data);
}
