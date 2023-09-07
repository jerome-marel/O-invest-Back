import Joi from 'joi';

const addAssetSchema = Joi.object({
  symbol: Joi.string().required(),
  purchaseDatetime: Joi.date().required(),
  quantity: Joi.number().required(),
  note: Joi.string().allow('').optional(),
});

export default addAssetSchema;
