import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../_prisma";
import { getUserByToken } from "../login";
import { HTTPError, handleHTTPError } from "../../_error";
import { BetState, UserBetState, UserBetTicketState, UserBetTickets, UserBetValue, UserBets } from "@prisma/client";
import random from "random-number-csprng";

type RandomValues = 1 | 2;

type CreateBetParams = {
    token?: string,
    value: UserBetValue,
};

export type UserBetsResponse = {
    myBets: UserBets[];
    myTickets: UserBetTickets[];
    totalWinnings: number;
};

// Configuração dos parâmetros de ganhos
const TICKET_PRICE = 1; // Preço atual do ticket no Stripe
const WINNING_MULTIPLIER = 1.8; // Retorno de 180% (devolução do valor + 80% de lucro)

// Função para calcular os ganhos totais do usuário
const calculateUserWinnings = (userBets: UserBets[]): number => {
    let totalWinnings = 0;

    userBets.forEach(bet => {
        if (bet.state === UserBetState.WON && !bet.isWithdrawn) {
            totalWinnings += TICKET_PRICE * WINNING_MULTIPLIER; // Aproximadamente 3.6 por aposta ganha
        }
    });

    return totalWinnings;
};

const generateRandomChicken = async (myBet: UserBetValue) => {
   const options = {
    '1': UserBetValue.CHICKEN_1,
    '2': UserBetValue.CHICKEN_2,
   };

    const value = await random(1, 2) as RandomValues;

    return options[value] === myBet ? UserBetState.WON : UserBetState.LOST;
}

export const getBet = async (token: string | undefined) => {
    const me = await getUserByToken(token);

    const myBets = await prisma.userBets.findMany({
        where: {
            userId: me.id,
        }
    });

    const myTickets = await prisma.userBetTickets.findMany({
        where: {
            userId: me.id,
            state: UserBetTicketState.PAYED,
            bet: null,
        }
    });

    // Calcular os ganhos totais disponíveis para o usuário
    const totalWinnings = calculateUserWinnings(myBets);

    return { myBets, myTickets, totalWinnings };
}

export const createBet = async ({ token, value }: CreateBetParams) => {
    const me = await getUserByToken(token);

    const ticket = await prisma.userBetTickets.findFirst({
        where: {
            userId: me.id,
            state: UserBetTicketState.PAYED,
            bet: null,
        }
    });

    if (!ticket) {
        throw new HTTPError({
            code: 400,
            message: "You have no credits"
        });
    }

    const bet = await prisma.bets.findFirst({
        where: {
            state: BetState.OPEN,
        },
        select: {
            id: true,
        }
    });

    if (!bet) {
        throw new HTTPError({
            code: 400,
            message: "bet is closed",
        });
    }

    const state = await generateRandomChicken(value);

    const myBet = await prisma.userBets.create({
        data: {
            userId: me.id,
            value: value,
            betId: bet.id,
            betTicketId: ticket.id,
            state: state,
        },
    });

    return myBet;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    switch (req.method) {
        case "GET":
            const data = await getBet(token)
            return res.status(200).json(data);
        case "POST":
            const { value } = req.body;
            const bets = await createBet({ token, value });
            return res.status(201).json(bets);
        default:
            res.status(405).json({ message: "method not allowed" });
            break
      }
  } catch (err) {
    handleHTTPError(res, err)
  }
}
