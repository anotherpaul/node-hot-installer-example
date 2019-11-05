const Joi = require('@hapi/joi');

const pluginSchema = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
    })
    .unknown(),
  file: Joi.object()
    .keys({
      filename: Joi.string().required(),
    })
    .unknown()
    .required(),
};

function pluginValidator(req, res, next) {
  const result = Joi.object(pluginSchema).validate({ body: req.body, file: req.file });
  if (result.error) {
    return res.status(400).send(result.error.annotate());
  }
  return next();
}

module.exports = {
  newPlugin: pluginValidator,
};
