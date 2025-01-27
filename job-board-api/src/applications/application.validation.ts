import Joi from 'joi';
import { objectId } from '../utils/custom.validation';
import { ApplicationStatus } from './application.model';

export const applyForJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    resumeId: Joi.string().custom(objectId).required(),
  }),
};

export const getApplications = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId).required(),
  }),
};

export const updateApplicationStatus = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid(...Object.values(ApplicationStatus)).required(),
  }),
};