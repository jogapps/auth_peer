const Joi = require('joi');
const { ROLES } = require('../utils/texts');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const register_user = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\)]+$/).messages({
      'string.pattern.base': '{{#label}} contains invalid characters. Enter valid phone number!',
    }).required(),
    password: Joi.string().min(6).required(),
    referral: Joi.string().optional(),
  }),
};

const account_activation = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).messages({
      'string.length': '{{#label}} Enter valid activation OTP!'
    }).required(),
  }),
};

const resend_activation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const password_reset_verify = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).messages({
      'string.length': '{{#label}} Enter valid Credentials!'
    }).required(),
  }),
};

const password_update = {
  body: Joi.object().keys({
    password: Joi.string().min(6).required(),
  }),
};

module.exports = {
  login,
  register_user,
  password_update,
  resend_activation,
  account_activation,
  password_reset_verify,
};
