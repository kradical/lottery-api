export interface ReqPick {
  numbers: number[];
  powerball: number;
}

export interface UserPick {
  numbers: Set<number>;
  powerball: number;
}

export interface ResPick {
  numbers: number[];
  powerball: number;
  isWinner: boolean;
  isJackpot: boolean;
  winnings: number;
}
