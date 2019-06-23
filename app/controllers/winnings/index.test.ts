import request from "supertest";

import app from "../../app";

const jackpotTicket = {
  date: "2010-02-03",
  picks: [
    {
      numbers: [17, 22, 36, 37, 52],
      powerball: 24
    }
  ]
};

const winningTicket = {
  date: "2010-02-03",
  picks: [
    {
      numbers: [17, 22, 36, 37, 52],
      powerball: 1
    }
  ]
};

const losingTicket = {
  date: "2010-02-06",
  picks: [
    {
      numbers: [1, 2, 3, 4, 5],
      powerball: 6
    }
  ]
};

const mixedTicket = {
  date: "2010-02-10",
  picks: [
    {
      numbers: [5, 8, 29, 37, 38],
      powerball: 24
    },
    {
      numbers: [1, 2, 3, 4, 6],
      powerball: 7
    }
  ]
};

test("with a date without a draw", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      date: "2000-01-01"
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('No draw found for date "2000-01-01"');
});

test("with a winning ticket", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send(winningTicket);

  expect(response.status).toBe(200);
  expect(response.body.hasWinner).toBe(true);
  expect(response.body.picks[0].isWinner).toBe(true);
});

test("with a jackpot ticket", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send(jackpotTicket);

  expect(response.status).toBe(200);
  expect(response.body.hasWinner).toBe(true);
  expect(response.body.hasJackpot).toBe(true);
  expect(response.body.picks[0].isWinner).toBe(true);
  expect(response.body.picks[0].isJackpot).toBe(true);
});

test("with a losing ticket", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send(losingTicket);

  expect(response.status).toBe(200);
  expect(response.body.hasWinner).toBe(false);
  expect(response.body.hasJackpot).toBe(false);
  expect(response.body.picks[0].isWinner).toBe(false);
});

test("with a mixed ticket", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send(mixedTicket);

  expect(response.status).toBe(200);
  expect(response.body.hasWinner).toBe(true);
  expect(response.body.picks[0].isWinner).toBe(true);
  expect(response.body.picks[1].isWinner).toBe(false);
});
