import jwt from 'jsonwebtoken';
import '../env.load.js';

const tokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
  try {
    const secretToken = process.env.TOKEN_SECRET;
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), secretToken);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  } return null;
};

export default tokenMiddleware;
