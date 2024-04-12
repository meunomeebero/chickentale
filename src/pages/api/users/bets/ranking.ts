import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../_prisma";

const getTop10bettors = async () => {
    const top10bettors = await prisma.users.findMany({
        take: 10,
        select: {
            name: true,
            myBets: {
                select: {
                    state: true
                }
            }
        },
        orderBy: {
            myBets: {
                _count: 'desc'
            }
        }
    });

    return top10bettors;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const top10bettors = await getTop10bettors();
        res.status(200).json(top10bettors);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
