import request from "supertest";

import app from "../../../app/app";

test("Winnings Route", async () => {
  const response = await request(app).post("/winnings");

  expect(response.status).toBe(200);
});

const ticket = {
  date: "2017-11-09",
  picks: [
    {
      numbers: [2, 14, 19, 21, 61],
      powerball: 25
    }
  ]
};

const winningTicket = {
  date: "2017-11-09",
  picks: [
    {
      numbers: [2, 14, 19, 21, 61],
      powerball: 25
    }
  ]
};

const losingTicket = {
  date: "2017-11-09",
  picks: [
    {
      numbers: [2, 14, 19, 21, 61],
      powerball: 25
    }
  ]
};

const mixedTicket = {
  date: "2017-11-09",
  picks: [
    {
      numbers: [2, 14, 19, 21, 61],
      powerball: 25
    },
    {
      numbers: [2, 14, 19, 21, 61],
      powerball: 25
    }
  ]
};

test("without a date", async () => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...ticket,
      date: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe('ticket "date" must be provided');
});

test("without picks", async () => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...ticket,
      picks: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe('ticket "picks" must be provided');
});

test("with empty picks", async () => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...ticket,
      picks: []
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe("ticket must have at least one pick");
});

test("with an invalid date", async () => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...ticket,
      date: "not a date"
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'Date "not a date" is not in valid format (YYYY-MM-DD)'
  );
});

test("with a date without a draw", async () => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...ticket,
      date: "2000-01-01"
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('No draw found for date "2000-01-01"');
});

test("with a winning ticket", async () => {
  const response = await request(app)
    .post("/winnings")
    .send(winningTicket);

  expect(response.status).toBe(200);
  expect(response.body.isWinner).toBe(true);
  expect(response.body.picks[0].isWinner).toBe(true);
});

test("with a losing ticket", async () => {
  const response = await request(app)
    .post("/winnings")
    .send(losingTicket);

  expect(response.status).toBe(200);
  expect(response.body.isWinner).toBe(false);
  expect(response.body.picks[0].isWinner).toBe(false);
});

test("with a mixed ticket", async () => {
  const response = await request(app)
    .post("/winnings")
    .send(mixedTicket);

  expect(response.status).toBe(200);
  expect(response.body.isWinner).toBe(true);
  expect(response.body.picks[0].isWinner).toBe(true);
  expect(response.body.picks[1].isWinner).toBe(false);
});
