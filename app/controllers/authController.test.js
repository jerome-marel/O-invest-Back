/* eslint-env jest */
import { Client } from 'pg';
import authController from './authController.js';
import '../utils/env.load.js';

let client;

beforeAll(async () => {
  client = new Client({
    user: 'oinvest',
    host: 'localhost',
    database: 'oinvest',
    password: 'oinvest',
    port: 5432,
  });

  await client.connect();
});

afterAll(async () => {
  await client.end();
});

test('should login user', async () => {
  const req = {
    body: {
      email: 'marco@gmail.com',
      password: process.env.USER_PWD, // Text version of password hash
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  // Call the real login method
  await authController.login(req, res);

  // Expectations
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User connected successfully to O'Invest" }));
});
