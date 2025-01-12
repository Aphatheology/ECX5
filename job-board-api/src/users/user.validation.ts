import Joi from 'joi';
import { password } from '../utils/custom.validation';

export const register = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const updateEmployerProfile = {
  body: Joi.object()
    .keys({
      companyName: Joi.string(),
      companyWebsite: Joi.string().uri(),
    })
    .or('companyName', 'companyWebsite'),
};

export const updateApplicantProfile = {
  body: Joi.object({
    headline: Joi.string().required(),
  }),
};
