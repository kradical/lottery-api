import request from "supertest";

import app from "../../app";
import { ValidationError } from "../../errors";

import { validateBody } from "./validation";

// User supertest.request for validation that would fail the type system

const validTicket = {
  date: "2010-02-03",
  picks: [
    {
      numbers: [17, 22, 36, 37, 52],
      powerball: 1
    }
  ]
};

test("without a date", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...validTicket,
      date: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe('ticket "date" must be provided');
});

test("without picks", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...validTicket,
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
      ...validTicket,
      picks: "I am not an array"
    });

  expect(response.status).toBe(422);
  expect(response.body.message).toBe(
    'an array of ticket "picks" must be provided'
  );
});

test("with empty picks", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: []
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick with missing numbers", async (): Promise<void> => {
  const response = await request(app)
    .post("/winnings")
    .send({
      ...validTicket,
      picks: [
        ...validTicket.picks,
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
      ...validTicket,
      picks: [
        ...validTicket.picks,
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
      ...validTicket,
      picks: [
        ...validTicket.picks,
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
      ...validTicket,
      picks: [
        ...validTicket.picks,
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
      ...validTicket,
      picks: [
        ...validTicket.picks,
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

test("with a pick with too many numbers", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5, 6],
          powerball: 7
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick with not enough numbers", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [1, 2, 3, 4],
          powerball: 5
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick with numbers duplicates", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [1, 1, 2, 3, 4],
          powerball: 5
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick number less than 1", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [0, 1, 2, 3, 4],
          powerball: 5
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick number greater than 69", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [70, 1, 2, 3, 4],
          powerball: 5
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick powerball less than 1", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5],
          powerball: 0
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with a pick powerball greater than 26", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      picks: [
        ...validTicket.picks,
        {
          numbers: [1, 2, 3, 4, 5],
          powerball: 27
        }
      ]
    });

  expect(t).toThrow(ValidationError);
});

test("with an invalid date", (): void => {
  const t = (): void =>
    validateBody({
      ...validTicket,
      date: "not a date"
    });

  expect(t).toThrow(ValidationError);
});
