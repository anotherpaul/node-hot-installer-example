const { celebrate, Joi } = require('celebrate');

const command = {
  body: Joi.object()
    .keys({
      plugin: Joi.string().required(),
      data: Joi.object().required(),
    })
    .unknown(),
};

module.exports = {
  command: celebrate(command),
};
