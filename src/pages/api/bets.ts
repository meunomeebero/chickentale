import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./_prisma";
import { HTTPError, handleHTTPError } from "./_error";

export const getBet = async  () => {
  const bet = await prisma.bets.findFirst({
    orderBy: {
      createdAt: "desc",
    }
  });

  if (!bet) {
    throw new HTTPError({ message: "no bet found", code: 404 });
  }

  const userBets = await prisma.userBets.findMany({
    where: {
      betId: bet?.id,
    }
  });

  return { bet, userBets };
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
