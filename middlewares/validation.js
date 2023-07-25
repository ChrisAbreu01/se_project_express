const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" is required',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" is required',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" is required',
    }),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" is required',
    }),
    avatar: Joi.string().custom(validateUrl).allow(null, "").messages({
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" is required',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" is required',
    }),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" is required',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.hex": "'_id' does not use hexadecimal values",
      "string.length": "'_id' length is not equal to 24",
    }),
  }),
});

const validateProfileAvatar = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field is required',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "avatar" field is required',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateCard,
  validateUserCreation,
  validateAuth,
  validateId,
  validateProfileAvatar,
};
