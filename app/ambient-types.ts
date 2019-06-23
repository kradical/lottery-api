// Incoming request data types

interface NyGovDraw {
  draw_date: string;
  winning_numbers: string;
}

interface ReqPick {
  numbers: number[];
  powerball: number;
}

interface ReqBody {
  date: string;
  picks: ReqPick[];
}

//  internal representations
interface Draw {
  date: string;
  numbers: Set<number>;
  powerball: number;
}

interface UserPick {
  numbers: Set<number>;
  powerball: number;
}

interface Ticket {
  date: string;
  picks: UserPick[];
}

// Outgoing response data types

interface ResPick {
  numbers: number[];
  powerball: number;
  isWinner: boolean;
  isJackpot: boolean;
  winnings: number;
}

interface ResTicket {
  date: string;
  hasWinner: boolean;
  hasJackpot: boolean;
  nonJackpotWinnings: number;
  picks: ResPick[];
}
