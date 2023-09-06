import loginSchema from './schemas/login.schema.js';
import registerSchema from './schemas/register.schema.js';
import portfolioSchema from './schemas/portfolio.schema.js';
import addAssetSchema from './schemas/addAsset.schema.js';

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next();
};

export const validatePortfolio = (req, res, next) => {
  const { error } = portfolioSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next();
};

export const validateAddAsset = (req, res, next) => {
  const { error } = addAssetSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next();
};
