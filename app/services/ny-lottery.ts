import { format, isAfter, isFuture, parse } from "date-fns";
import fetch from "node-fetch";

import { Draw, NyGovDraw } from "../types/draw";

const URL = "https://data.ny.gov/resource/d6yy-54nr.json";
const DATE_FORMAT = "YYYY-MM-DD";

const MIN_TIME_STAMP = -8640000000000000;
const getDistantPast = (): Date => new Date(MIN_TIME_STAMP);

export class NyLotteryService {
  // cache draws in process
  private cache = new Map<string, Draw>();
  private latestCached = getDistantPast();

  private fetchDraws = async (): Promise<[NyGovDraw]> => {
    const response = await fetch(URL);
    const json = await response.json();

    return json;
  };

  private refreshCache = async (): Promise<void> => {
    const fetchedDraws = await this.fetchDraws();

    // Assume fetched data is valid
    fetchedDraws.forEach((draw): void => {
      const drawDate = parse(draw.draw_date);
      const key = format(drawDate, DATE_FORMAT);

      if (isAfter(drawDate, this.latestCached)) {
        this.latestCached = drawDate;
      }

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
    const hasDate = this.cache.has(date);
    const inFuture = isFuture(date);
    const afterLatest = isAfter(date, this.latestCached);

    const shouldRefreshCache = !hasDate && !inFuture && afterLatest;

    if (shouldRefreshCache) {
      await this.refreshCache();
    }

    return this.cache.get(date);
  };
}
