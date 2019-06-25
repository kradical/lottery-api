import { ReqPick, ResPick, UserPick } from "./pick";

export interface ReqTicket {
  date: string;
  picks: ReqPick[];
}

export interface Ticket {
  date: string;
  picks: UserPick[];
}

export interface ResTicket {
  date: string;
  hasWinner: boolean;
  hasJackpot: boolean;
  nonJackpotWinnings: number;
  picks: ResPick[];
}
