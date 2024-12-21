import Joi from 'joi';

export const createShortUrl = {
  body: Joi.object().keys({
    longUrl: Joi.string().required(),
  }),
};

export const getUrl = {
  params: Joi.object().keys({
    shortUrl: Joi.string().required(),
  }),
};
