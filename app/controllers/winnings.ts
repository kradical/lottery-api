import { Request, Response } from "express";

import { UnprocessableEntityError } from "../errors";

// const mockResponse = {
//   date: '2017-11-09',
//   isWinner: true,
//   totalPot: 500,
//   picks: [
//     {
//       numbers: [2, 14, 19, 21, 61],
//       powerball: 25,
//       isWinner: true,
//       pot: 500
//     },
//   ],
// }

const validateDate = (date: string): void => {
  if (!date) {
    throw new UnprocessableEntityError('ticket "date" must be provided');
  }
};

const validatePicks = (picks: []): void => {
  console.log(picks);
};

const winnings = (req: Request, res: Response): void => {
  // Validate request format
  const { date, picks } = req.body;

  validateDate(date);
  validatePicks(picks);

  // Create some error types
  // check winnings
  // respond
  res.json({ message: "winner winner" });
};

export default winnings;
