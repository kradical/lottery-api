import request from "supertest";

import app from "../app";

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

test("without a date", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      date: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe('ticket "date" must be provided');
});

test("without picks", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'an array of ticket "picks" must be provided'
  );
});

test("with non array picks", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: "I am not an array"
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'an array of ticket "picks" must be provided'
  );
});

test("with empty picks", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: []
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe("ticket must have at least one pick");
});

test("with a pick with missing numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          powerball: 1
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'an array of ticket pick "numbers" must be provided'
  );
});

test("with a pick without a powerball", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5]
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe('ticket pick must have a "powerball"');
});

test("with a pick with non array numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: "I am not an array",
          powerball: 1
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'an array of ticket pick "numbers" must be provided'
  );
});

test("with a pick with non-number powerball", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5],
          powerball: "I am not a number"
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "powerball" must be an integer'
  );
});

test("with a pick with non-number numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, "I am not a number"],
          powerball: 5
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "numbers" must be an array of numbers'
  );
});

test("with a pick with too many numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5, 6],
          powerball: 7
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe("ticket pick must have exactly 5 numbers");
});

test("with a pick with not enough numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4],
          powerball: 5
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe("ticket pick must have exactly 5 numbers");
});

test("with a pick with numbers duplicates", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 1, 3, 4, 5],
          powerball: 6
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "numbers" must not have duplicates'
  );
});

test("with a pick number less than 1", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [0, 2, 3, 4, 5],
          powerball: 1
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "numbers" must be in range [1, 69]'
  );
});

test("with a pick number greater than 69", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [70, 2, 3, 4, 5],
          powerball: 1
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "numbers" must be in range [1, 69]'
  );
});

test("with a pick powerball less than 1", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5],
          powerball: 0
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "powerball" must be in range [1, 26]'
  );
});

test("with a pick powerball greater than 26", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      picks: [
        ...winningTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5],
          powerball: 27
        }
      ]
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'ticket pick "powerball" must be in range [1, 26]'
  );
});

test("with an invalid date", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...winningTicket,
      date: "not a date"
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'Date "not a date" is not in valid format (ISO-8601)'
  );
});

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
