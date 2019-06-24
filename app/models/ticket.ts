interface Ticket {
  date: string;
  picks: UserPick[];
}

interface ResTicket {
  date: string;
  hasWinner: boolean;
  hasJackpot: boolean;
  nonJackpotWinnings: number;
  picks: ResPick[];
}
