import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../_prisma";
import { getMe } from "../../_services";
import { HTTPError, handleHTTPError } from "../../_error";
import { stripe } from "@/utils/stripe";

/**
 * It throws a 404 httpError if user is not found!
 */
export const getUserByToken = async (token: string | undefined) => {
  if (!token) throw new HTTPError({ message: "You must send a valid bearer token", code: 401 });

  const user = await getMe(token);

  let dbUser = await prisma.users.findFirst({
    where: {
      email: user.email,
    }
  });

  if (!dbUser) {
    const { id: paymentClientId } = await stripe.customers.create({
      name: user.email,
    });

    dbUser = await prisma.users.create({
      data: {
        email: user.email,
        image: user.picture,
        name: user.name,
        paymentClientId,
      }
    });
  }

  if (!dbUser.paymentClientId) {
    const { id: paymentClientId } = await stripe.customers.create({
        name: user.email,
    });

    dbUser = await prisma.users.update({
        where: {
            id: dbUser.id,
        },
        data: {
            paymentClientId,
        }
    });
  }

  return dbUser;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const dbUser = await getUserByToken(token);
    return res.status(200).json(dbUser);
  } catch(err) {
    handleHTTPError(res, err);
  }
}
