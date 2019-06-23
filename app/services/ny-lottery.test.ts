import { NyLotteryService } from "./ny-lottery";

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
