import { isValid, parse } from "date-fns";

import { ValidationError } from "../../errors";
import { ReqPick } from "../../types/pick";
import { ReqTicket } from "../../types/ticket";

const validateDate = (date: string): void => {
  if (!date) {
    throw new ValidationError('ticket "date" must be provided');
  }

  const drawDate = parse(date);

  if (!isValid(drawDate)) {
    const message = `Date "${date}" is not in valid format (ISO-8601)`;
    throw new ValidationError(message);
  }
};

const validatePickPowerball = (powerball: number): void => {
  if (!powerball && powerball !== 0) {
    throw new ValidationError('ticket pick must have a "powerball"');
  }

  if (!Number.isInteger(powerball)) {
    throw new ValidationError('ticket pick "powerball" must be an integer');
  }

  if (powerball < 1 || powerball > 26) {
    throw new ValidationError(
      'ticket pick "powerball" must be in range [1, 26]'
    );
  }
};

const validatePickNumber = (lotteryNumber: number): void => {
  if (!Number.isInteger(lotteryNumber)) {
    throw new ValidationError(
      'ticket pick "numbers" must be an array of numbers'
    );
  }

  if (lotteryNumber < 1 || lotteryNumber > 69) {
    throw new ValidationError('ticket pick "numbers" must be in range [1, 69]');
  }
};

const validatePick = (pick: ReqPick): void => {
  if (!pick.numbers || !Array.isArray(pick.numbers)) {
    throw new ValidationError(
      'an array of ticket pick "numbers" must be provided'
    );
  }

  if (pick.numbers.length !== 5) {
    throw new ValidationError("ticket pick must have exactly 5 numbers");
  }

  pick.numbers.forEach(validatePickNumber);
  validatePickPowerball(pick.powerball);

  const numbers = new Set(pick.numbers);

  if (numbers.size !== pick.numbers.length) {
    throw new ValidationError('ticket pick "numbers" must not have duplicates');
  }
};

const validatePicks = (picks: ReqPick[]): void => {
  if (!picks || !Array.isArray(picks)) {
    throw new ValidationError('an array of ticket "picks" must be provided');
  }

  if (picks.length === 0) {
    throw new ValidationError("ticket must have at least one pick");
  }

  picks.forEach(validatePick);
};

export const validateBody = (body: ReqTicket): void => {
  const { date, picks }: ReqTicket = body;

  validateDate(date);
  validatePicks(picks);
};
