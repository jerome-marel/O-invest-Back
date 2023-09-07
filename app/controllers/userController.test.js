/* eslint-env jest */
// userController.test.js
import userController from './userController.js';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

// Mock Models
jest.mock('../models/User');
jest.mock('../models/Portfolio');
jest.mock('../models/PortfolioAsset');
jest.mock('../models/Transaction');

// Mock Implementations
User.findByPk.mockImplementation(async (id) => {
  if (id) {
    return {
      id: 1, firstName: 'Marco', lastName: 'Cubano', destroy: jest.fn(),
    };
  }
  return null;
});

Portfolio.findAll.mockImplementation(async (where) => {
  if (where.where.userId) return [{ id: 1, name: 'Portfolio1', destroy: jest.fn() }];
  return [];
});

PortfolioAsset.findAll.mockImplementation(async (where) => {
  if (where.where.portfolioId) return [{ id: 1, name: 'Asset1', destroy: jest.fn() }];
  return [];
});

Transaction.findAll.mockImplementation(async (where) => {
  if (where.where.portfolioAssetId) return [{ id: 1, destroy: jest.fn() }];
  return [];
});

Transaction.destroy.mockImplementation(jest.fn());
PortfolioAsset.destroy.mockImplementation(jest.fn());
Portfolio.destroy.mockImplementation(jest.fn());

// Test for getProfile Method
test('should return user info', async () => {
  const req = {
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'User found in database',
    userInfo: { id: 1, firstName: 'Marco', lastName: 'Cubano' },
  });
});

// Mock implementation returning null
User.findByPk.mockImplementation(async () => null);

test('should return 404 if user not found', async () => {
  const req = { user: { id: 99 } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
});

// Testing editProfile function
test('editProfile should update user', async () => {
  const req = {
    params: { id: 1 },
    body: {
      firstName: 'Irma', lastName: 'Cubana', email: 'Irma.Cubano@gmail.com', riskProfile: 'medium',
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.editProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully', foundUser: { id: 1, firstName: 'Marco', lastName: 'Cubano' } });
});

// Testing editProfile with invalid data
test('editProfile should return 400 for invalid input', async () => {
  const req = {
    params: { id: 1 },
    body: {
      firstName: 'Irma123', // invalid firstName containing numbers
      lastName: 'Cubana',
      email: 'Irma.Cubano@gmail.com',
      riskProfile: 'medium',
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.editProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found. Please check the provided id.' });
});

// Testing deleteProfile function
test('deleteProfile should delete user and associated data', async () => {
  const req = { user: { id: 1 } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.deleteProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    message: 'Profile deleted, associated portfolios deleted',
  }));
});
