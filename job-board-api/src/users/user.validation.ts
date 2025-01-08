import Joi from 'joi';
import { password } from '../utils/custom.validation';

const register = {
    body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        username: Joi.string().required(),
    }),
};

const login = {
    body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

export default {
    register,
    login,
};
