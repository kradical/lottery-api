import { mockFetchJson } from "../setup-tests";

import { NyLotteryService } from "./ny-lottery";

afterAll((): void => {
  mockFetchJson.mockReturnValue(undefined);
});

/* eslint-disable @typescript-eslint/camelcase */
beforeEach((): void => {
  mockFetchJson.mockReset();
  mockFetchJson.mockReturnValue([
    {
      draw_date: "2010-02-03",
      winning_numbers: "17 22 36 37 52 24"
    }
  ]);
});
/* eslint-enable @typescript-eslint/camelcase */

test("for a draw that exists", async (): Promise<void> => {
  const service = new NyLotteryService();
  const draw = await service.getDraw("2010-02-03");

  expect(draw).not.toBe(undefined);
});

test("for a draw that doesnt exist", async (): Promise<void> => {
  const service = new NyLotteryService();
  const draw = await service.getDraw("2010-02-04");

  expect(draw).toBe(undefined);
});

test("cache behaviour for repeated calls to a draw that exists", async (): Promise<
  void
> => {
  const service = new NyLotteryService();
  await service.getDraw("2010-02-03");
  await service.getDraw("2010-02-03");
  await service.getDraw("2010-02-03");
  await service.getDraw("2010-02-03");
  await service.getDraw("2010-02-03");

  expect(mockFetchJson.mock.calls).toHaveLength(1);
});
