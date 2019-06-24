interface NyGovDraw {
  draw_date: string;
  winning_numbers: string;
}

//  internal representations
interface Draw {
  date: string;
  numbers: Set<number>;
  powerball: number;
}
