import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleUser } from "../../_dtos";
import { prisma } from "../../_prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "You must send a valid bearer token" });
  }

  const data = await fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + token,
  );

  if (data.status !== 200) {
    const message = await data.text();
    return res.status(401).json({ message: "You must send a valid bearer token", error: message });
  }

  const json = await data.json();

  const user = new GoogleUser(json);

  let dbUser = await prisma.users.findFirst({
    where: {
        email: user.email,
    }
  });

  if (!dbUser) {
    dbUser = await prisma.users.create({
        data: {
            email: user.email,
            image: user.picture,
            name: user.name,
        }
    });
  }

  return res.status(200).json(dbUser);
}
