import request from 'supertest';

import app from '../../../app/app';

test('Hello World Controller', async () => {
  const response = await request(app).get('/');

  expect(JSON.parse(response.text)).toEqual({ message: 'Hello World' });
});

test('Not Found Route', async () => {
  const response = await request(app).get('/notfound');

  expect(response.status).toBe(404);
});
