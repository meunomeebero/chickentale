import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { UserBetState } from '@prisma/client'

interface RankingPlayer {
  id: number
  name: string
  email: string
  winCount: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get all users with their bet statistics
    const users = await prisma.users.findMany({
      include: {
        myBets: {
          where: {
            state: UserBetState.WON
          }
        }
      }
    })

    // Format the data with win counts and sort by wins
    const rankings: RankingPlayer[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      winCount: user.myBets.length
    }))
    .sort((a, b) => b.winCount - a.winCount)
    .slice(0, 100) // Limit to top 100 players

    return res.status(200).json({ rankings })
  } catch (error) {
    console.error('Error fetching ranking:', error)
    return res.status(500).json({ message: 'Failed to fetch ranking data' })
  }
}
