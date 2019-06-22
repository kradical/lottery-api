import request from "supertest";

import app from "../app";

test("Not Found Route", async (): Promise<void> => {
  const response = await request(app).get("/notfound");

  expect(response.status).toBe(404);
});
