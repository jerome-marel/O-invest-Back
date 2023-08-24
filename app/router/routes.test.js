import request from 'supertest';
import app from '../app.js';

test('GET / must respond with a 200 status', () => {
  request(app)
    .post('/register')
    .expect(200);
});
test('POST /register must respond with a 201 status', () => {
  request(app)
    .post('/register')
    .expect(201);
});
test('POST /login must respond with a 201 status', () => {
  request(app)
    .post('/login')
    .expect(201);
});
