import Joi from 'joi';

const portfolioSchema = Joi.object({
  userId: Joi.number().required(),
  name: Joi.string().required(),
  strategy: Joi.string().allow('').optional(),
  userId: Joi.number().required(),

});

export default portfolioSchema;
