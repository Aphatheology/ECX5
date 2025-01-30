import Joi from 'joi';
import { password } from '../utils/custom.validation';

export const register = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required()
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const refreshToken = {
  body: Joi.object({
    token: Joi.string().required(),
  }),
};
