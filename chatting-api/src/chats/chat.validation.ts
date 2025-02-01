import Joi from "joi";
import { objectId } from '../utils/custom.validation';
import { MsgTypeEnum } from './message.model';

export const createChat = {
  body: Joi.object({
    members: Joi.array().items(Joi.string().required().custom(objectId)),
    isGroup: Joi.boolean().required(),
    name: Joi.when("isGroup", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
};

export const sendMessage = {
  body: Joi.object({
    chatId: Joi.string().required().custom(objectId),
    content: Joi.string().optional().allow(''),
    typeOfMsg: Joi.string().valid(...Object.values(MsgTypeEnum)).required(),
    fileURL: Joi.string().when('typeOfMsg', {
      is: Joi.string().valid('text'),
      then: Joi.optional().allow(''), 
      otherwise: Joi.required().not(''),
    }),
    fileSize: Joi.number().optional(),
  }),
};

export const getWithId = {
  params: Joi.object().keys({
    chatId: Joi.string().required(),
  }),
};
