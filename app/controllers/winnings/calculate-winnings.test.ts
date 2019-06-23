import { calculateWinnings } from "./calculate-winnings";

test("no matches", (): void => {
  const winnings = calculateWinnings(0, false);

  expect(winnings).toBe(0);
});

test("all matches (jackpot)", (): void => {
  const winnings = calculateWinnings(5, true);

  expect(winnings).toBe(0);
});

test("invalid input", (): void => {
  const winnings = calculateWinnings(6, false);

  expect(winnings).toBe(0);
});

test("three matches with powerball", (): void => {
  const winnings = calculateWinnings(3, true);

  expect(winnings).toBe(100);
});
