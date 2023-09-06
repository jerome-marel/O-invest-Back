import Joi from 'joi';

const portfolioSchema = Joi.object({
  name: Joi.string().required(),
  strategy: Joi.string().required(),
});

export default portfolioSchema;
