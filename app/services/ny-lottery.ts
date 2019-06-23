import { format, parse } from "date-fns";
import fetch from "node-fetch";

const URL = "https://data.ny.gov/resource/d6yy-54nr.json";
const DATE_FORMAT = "YYYY-MM-DD";

export class NyLotteryService {
  // cache draws in process
  private cache = new Map<string, Draw>();

  private fetchDraws = async (): Promise<[NyGovDraw]> => {
    const response = await fetch(URL);
    const json = await response.json();

    return json;
  };

  private refreshCache = async (): Promise<void> => {
    const fetchedDraws = await this.fetchDraws();

    // Assume fetched data is valid
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

      this.cache.set(key, value);
    });
  };

  public getDraw = async (date: string): Promise<Draw | undefined> => {
    if (!this.cache.has(date)) {
      await this.refreshCache();
    }

    return this.cache.get(date);
  };
}
