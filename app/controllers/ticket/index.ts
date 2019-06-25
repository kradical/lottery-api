import { NextFunction, Request, Response } from "express";

import { NotFoundError, UnprocessableEntityError } from "../../errors";
import { NyLotteryService } from "../../services/ny-lottery";
import { Draw } from "../../types/draw";
import { UserPick, ResPick } from "../../types/pick";
import { Ticket, ReqTicket, ResTicket } from "../../types/ticket";
import { intersection } from "../../utils/set";

import { validateBody } from "./validation";
import { calculateWinnings } from "./calculate-winnings";

const getPickWithWinnings = (pick: UserPick, draw: Draw): ResPick => {
  const matching = intersection(pick.numbers, draw.numbers);
  const matchCount = matching.size;

  const doesPowerballMatch = pick.powerball === draw.powerball;

  const isJackpot = matchCount === 5 && doesPowerballMatch;
  const winnings = calculateWinnings(matchCount, doesPowerballMatch);
  const isWinner = winnings > 0 || isJackpot;

  return {
    numbers: [...pick.numbers],
    powerball: pick.powerball,
    isWinner,
    isJackpot,
    winnings
  };
};

const getTicketWithWinnings = (picks: UserPick[], draw: Draw): ResTicket => {
  const newPicks: ResPick[] = picks.map(
    (p): ResPick => {
      return getPickWithWinnings(p, draw);
    }
  );

  const hasWinner = newPicks.some((p): boolean => p.isWinner);
  const hasJackpot = newPicks.some((p): boolean => p.isJackpot);

  const nonJackpotWinnings = newPicks.reduce(
    (acc, cur): number => acc + cur.winnings,
    0
  );

  return {
    date: draw.date,
    hasWinner,
    hasJackpot,
    nonJackpotWinnings,
    picks: newPicks
  };
};

const lotteryService = new NyLotteryService();

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    validateBody(req.body);
  } catch (error) {
    throw new UnprocessableEntityError(error.message);
  }

  return next();
};

export const checkWinnings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date, picks }: ReqTicket = req.body;

  const ticket: Ticket = {
    date,
    picks: picks.map(
      (p): UserPick => ({
        numbers: new Set(p.numbers),
        powerball: p.powerball
      })
    )
  };

  const draw = await lotteryService.getDraw(ticket.date);

  if (!draw) {
    throw new NotFoundError(`No draw found for date "${date}"`);
  }

  const ResTicket = getTicketWithWinnings(ticket.picks, draw);

  res.json(ResTicket);
};
