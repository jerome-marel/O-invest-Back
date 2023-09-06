import Joi from 'joi';

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
  riskProfile: Joi.string().required(),
});

export default registerSchema;
