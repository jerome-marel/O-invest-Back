/* eslint-env jest */
import bcrypt from 'bcryptjs';
import authController from './authController.js';
import User from '../models/User.js'; // I Mock this

jest.mock('../models/User');

// mock User.findOne
User.findOne.mockImplementation(async () => null); // Return null to simulate user not found in DB

test('should register user', async () => {
  const req = {
    body: {
      firstName: 'Marco',
      lastName: 'Cubano',
      email: 'marco.cubano@gmail.com',
      password: 'securePassword',
      passwordConfirm: 'securePassword',
      riskProfile: 'low',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await authController.register(req, res);

  // Expecting 201 status for successful registration
  expect(res.status).toHaveBeenCalledWith(201);
  // Expecting a specific message in the response
  expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
});

// the test for the login function

test('should login user', async () => {
  User.findOne.mockImplementation(async () => ({
    id: 1,
    email: 'marco.cubano@gmail.com',
    password: 'mockHashedPassword',
  }));

  const req = {
    body: {
      email: 'marco.cubano@gmail.com',
      password: 'securePassword',
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  // Mock bcrypt.compare to return true, assuming password is correct
  bcrypt.compare = jest.fn().mockReturnValue(true);

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User connected successfully to O'Invest" }));
});
