export const calculateWinnings = (
  matchCount: number,
  doesPowerballMatch: boolean
): number => {
  switch (matchCount) {
    case 0:
    case 1:
      return doesPowerballMatch ? 4 : 0;
    case 2:
      return doesPowerballMatch ? 7 : 0;
    case 3:
      return doesPowerballMatch ? 100 : 7;
    case 4:
      return doesPowerballMatch ? 50_000 : 100;
    case 5:
      // jackpot isn't calculated as part of the winnings and is handled separately
      return doesPowerballMatch ? 0 : 1_000_000;
    default:
      return 0;
  }
};
