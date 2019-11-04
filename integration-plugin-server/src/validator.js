const { Joi } = require('celebrate');

const newPlugin = Joi.object({
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
  file: Joi.object()
    .keys({
      filename: Joi.string().required(),
    })
    .unknown(),
}).unknown();

module.exports = {
  newPlugin,
};
