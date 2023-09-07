import Joi from 'joi';

const portfolioSchema = Joi.object({
  name: Joi.string().required(),
  strategy: Joi.string().allow('').optional(),
  userId: Joi.number().required(),
});

export default portfolioSchema;
