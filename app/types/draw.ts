export interface NyGovDraw {
  draw_date: string;
  winning_numbers: string;
}

export interface Draw {
  date: string;
  numbers: Set<number>;
  powerball: number;
}
