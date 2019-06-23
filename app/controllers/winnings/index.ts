import { NextFunction, Request, Response } from "express";

import { NotFoundError, UnprocessableEntityError } from "../../errors";
import { NyLotteryService } from "../../services/ny-lottery";
import { intersection } from "../../utils/set";

import { validateBody } from "./validation";
import { calculateWinnings } from "./calculate-winnings";

const getResPick = (pick: UserPick, draw: Draw): ResPick => {
  const matching = intersection(pick.numbers, draw.numbers);
  const matchCount = matching.size;

  const doesPowerballMatch = pick.powerball === draw.powerball;

  const isWinner = matchCount > 0 || doesPowerballMatch;
  const isJackpot = matchCount === 5 && doesPowerballMatch;

  const winnings = calculateWinnings(matchCount, doesPowerballMatch);

  return {
    numbers: [...pick.numbers],
    powerball: pick.powerball,
    isWinner,
    isJackpot,
    winnings
  };
};

const getResTicket = (picks: UserPick[], draw: Draw): ResTicket => {
  const newPicks: ResPick[] = picks.map(
    (p): ResPick => {
      return getResPick(p, draw);
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
  const { date, picks }: ReqBody = req.body;

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

  const ResTicket = getResTicket(ticket.picks, draw);

  res.json(ResTicket);
};
