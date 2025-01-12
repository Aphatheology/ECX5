import Joi from 'joi';
import { objectId } from 'utils/custom.validation';
import { JobStatus, JobTypeEnum } from './job.model';

export const createJob = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    location: Joi.string().min(2).max(100).required(),
    salary: Joi.number().positive().optional(),
    jobType: Joi.string().valid(JobTypeEnum.CONTRACT, JobTypeEnum.FREELANCE, JobTypeEnum.FULL_TIME, JobTypeEnum.CONTRACT).required(),
    employerId: Joi.string().required().custom(objectId),
  }),
};

export const getWithId = {
  params: Joi.object().keys({
    jobId: Joi.string().required(),
  }),
};

export const updateJob = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    location: Joi.string().min(2).max(100).optional(),
    salary: Joi.number().positive().optional(),
    jobType: Joi.string()
      .valid(JobTypeEnum.CONTRACT, JobTypeEnum.FREELANCE, JobTypeEnum.FULL_TIME, JobTypeEnum.CONTRACT)
      .optional(),
  }),
  params: Joi.object().keys({
    jobId: Joi.string().required().custom(objectId),
  }),
};

export const updateJobStatus = {
  params: Joi.object().keys({
    jobId: Joi.string().required(),
    JobStatus: Joi.string().required().valid(JobStatus.ACTIVE, JobStatus.INACTIVE, JobStatus.APPROVED, JobStatus.DISAPPROVED),
  }),
};
