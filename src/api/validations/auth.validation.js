const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const register_user = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\)]+$/).messages({
      'string.pattern.base': '{{#label}} contains invalid characters. Enter valid phone number!',
    }).min(9).required(),
    password: Joi.string().min(6).required(),
  }),
};

module.exports = {
  login,
  register_user,
};
