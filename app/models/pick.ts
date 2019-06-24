// Incoming request data types

interface ReqPick {
  numbers: number[];
  powerball: number;
}

interface UserPick {
  numbers: Set<number>;
  powerball: number;
}

// Outgoing response data types

interface ResPick {
  numbers: number[];
  powerball: number;
  isWinner: boolean;
  isJackpot: boolean;
  winnings: number;
}
