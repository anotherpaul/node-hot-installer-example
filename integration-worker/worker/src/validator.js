const { Joi } = require('celebrate');

const command = Joi.object({
  body: Joi.object()
    .keys({
      plugin: Joi.string().required(),
      data: Joi.object().required(),
    })
    .unknown(),
}).unknown();

module.exports = {
  command,
};
