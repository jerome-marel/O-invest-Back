import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Accès refusé, token requis');

  try {
    const secretToken = process.env.TOKEN_SECRET;
    const verified = jwt.verify(token, secretToken);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Token non valide' });
  }
  return null;
};

export default verifyToken;
