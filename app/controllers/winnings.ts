import { NextFunction, Request, Response } from "express";
import { format, isValid, parse } from "date-fns";
import fetch from "node-fetch";

import { NotFoundError, UnprocessableEntityError } from "../errors";

// TODO:
//   - refactor this file into  types and utilities and validation
//   - write some tests for caching behaviour
//   - deploy this (ec2, pm2, best way to deploy from circleci to ec2 (codedeploy?))

const DATE_FORMAT = "YYYY-MM-DD";

interface NyGovDraw {
  draw_date: string;
  winning_numbers: string;
}

interface Draw {
  date: string;
  numbers: Set<number>;
  powerball: number;
}

interface ReqPick {
  numbers: number[];
  powerball: number;
}

interface ReqBody {
  date: string;
  picks: ReqPick[];
}

interface Pick {
  numbers: Set<number>;
  powerball: number;
}

interface Ticket {
  date: string;
  picks: Pick[];
}

interface PickWinnings {
  numbers: number[];
  powerball: number;
  isWinner: boolean;
  isJackpot: boolean;
  winnings: number;
}

interface TicketWinnings {
  date: string;
  hasWinner: boolean;
  hasJackpot: boolean;
  nonJackpotWinnings: number;
  picks: PickWinnings[];
}

// cache draws in process
const drawsCache = new Map<string, Draw>();

const drawsUrl = "https://data.ny.gov/resource/d6yy-54nr.json";

const fetchDraws = async (): Promise<[NyGovDraw]> => {
  const response = await fetch(drawsUrl);
  const json = await response.json();

  return json;
};

const refreshCache = async (): Promise<void> => {
  const fetchedDraws = await fetchDraws();

  // Assume fetched data is valid and nicely formatted
  fetchedDraws.forEach((draw): void => {
    const key = format(parse(draw.draw_date), DATE_FORMAT);

    const winningNumbers = draw.winning_numbers
      .split(" ")
      .map((str): number => +str);

    const value: Draw = {
      date: key,
      numbers: new Set(winningNumbers.slice(0, 5)),
      powerball: winningNumbers[5]
    };

    drawsCache.set(key, value);
  });
};

function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();

  a.forEach((value): void => {
    if (b.has(value)) {
      result.add(value);
    }
  });

  return result;
}

const calculateWinnings = (
  matchCount: number,
  doesPowerballMatch: boolean
): number => {
  switch (matchCount) {
    case 0:
    case 1:
      return doesPowerballMatch ? 4 : 0;
    case 2:
      return doesPowerballMatch ? 7 : 0;
    case 3:
      return doesPowerballMatch ? 100 : 7;
    case 4:
      return doesPowerballMatch ? 50_000 : 100;
    case 5:
      // jackpot isn't calculated as part of the winnings and is handled separately
      return doesPowerballMatch ? 0 : 1_000_000;
    default:
      return 0;
  }
};

const getPickWinnings = (pick: Pick, draw: Draw): PickWinnings => {
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

const getTicketWinnings = (picks: Pick[], draw: Draw): TicketWinnings => {
  const newPicks: PickWinnings[] = picks.map(
    (p): PickWinnings => {
      return getPickWinnings(p, draw);
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

const getDraw = async (date: string): Promise<Draw> => {
  if (!drawsCache.has(date)) {
    await refreshCache();
  }

  const draw = drawsCache.get(date);

  if (!draw) {
    throw new NotFoundError(`No draw found for date "${date}"`);
  }

  return draw;
};

const validateDate = (date: string): void => {
  if (!date) {
    throw new UnprocessableEntityError('ticket "date" must be provided');
  }

  const drawDate = parse(date);

  if (!isValid(drawDate)) {
    const message = `Date "${date}" is not in valid format (ISO-8601)`;
    throw new UnprocessableEntityError(message);
  }
};

const validatePickPowerball = (powerball: number): void => {
  if (!powerball && powerball !== 0) {
    throw new UnprocessableEntityError('ticket pick must have a "powerball"');
  }

  if (!Number.isInteger(powerball)) {
    throw new UnprocessableEntityError(
      'ticket pick "powerball" must be an integer'
    );
  }

  if (powerball < 1 || powerball > 26) {
    throw new UnprocessableEntityError(
      'ticket pick "powerball" must be in range [1, 26]'
    );
  }
};

const validatePickNumber = (lotteryNumber: number): void => {
  if (!Number.isInteger(lotteryNumber)) {
    throw new UnprocessableEntityError(
      'ticket pick "numbers" must be an array of numbers'
    );
  }

  if (lotteryNumber < 1 || lotteryNumber > 69) {
    throw new UnprocessableEntityError(
      'ticket pick "numbers" must be in range [1, 69]'
    );
  }
};

const validatePick = (pick: ReqPick): void => {
  if (!pick.numbers || !Array.isArray(pick.numbers)) {
    throw new UnprocessableEntityError(
      'an array of ticket pick "numbers" must be provided'
    );
  }

  if (pick.numbers.length !== 5) {
    throw new UnprocessableEntityError(
      "ticket pick must have exactly 5 numbers"
    );
  }

  pick.numbers.forEach(validatePickNumber);
  validatePickPowerball(pick.powerball);

  const numbers = new Set(pick.numbers);

  if (numbers.size !== pick.numbers.length) {
    throw new UnprocessableEntityError(
      'ticket pick "numbers" must not have duplicates'
    );
  }
};

const validatePicks = (picks: ReqPick[]): void => {
  if (!picks || !Array.isArray(picks)) {
    throw new UnprocessableEntityError(
      'an array of ticket "picks" must be provided'
    );
  }

  if (picks.length === 0) {
    throw new UnprocessableEntityError("ticket must have at least one pick");
  }

  picks.forEach(validatePick);
};

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { date, picks }: ReqBody = req.body;

  validateDate(date);
  validatePicks(picks);

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
      (p): Pick => ({
        numbers: new Set(p.numbers),
        powerball: p.powerball
      })
    )
  };

  const draw = await getDraw(ticket.date);
  const ticketWinnings = getTicketWinnings(ticket.picks, draw);

  res.json(ticketWinnings);
};
