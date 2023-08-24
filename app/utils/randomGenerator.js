import crypto from 'crypto';

export default function generateRandomHex(length) {
  return crypto.randomBytes(length).toString('hex');
}

// on peut se servir de cette fonction dans les autres files pour générer une clé aléatoire:

// import { generateRandomHex } from './randomGenerator.js';
// const randomHex = generateRandomHex(length);
// console.log(randomHex);
