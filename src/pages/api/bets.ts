import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./_prisma";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  const bet = await prisma.bets.findFirst({
    where: {
      isFinished: false,
    }
  })

  if (!bet) {
    return res.status(400).json({ message: "Bet not found" });
  }

  const userBets = await prisma.userBets.findMany({
    where: {
      betId: bet?.id,
    }
  })

  return res.status(200).json({ bet, userBets });
}
