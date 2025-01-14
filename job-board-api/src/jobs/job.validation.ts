import Joi from 'joi';
import { objectId } from '..//utils/custom.validation';
import { JobStatus, JobTypeEnum, SalaryCurrency, SalaryPer, WorkFrom } from './job.dto';

export const createJob = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(150).required(),
    companyName: Joi.string().required(),
    stack: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().min(50).required(),
    location: Joi.string().required(),
    salary: Joi.number().positive().optional(),
    salaryCurrency: Joi.string().valid(SalaryCurrency.EUR, SalaryCurrency.GBP, SalaryCurrency.NGN, SalaryCurrency.USD).optional(),
    salaryPer: Joi.string().valid(SalaryPer.HOUR, SalaryPer.WEEK, SalaryPer.MONTH, SalaryPer.YEAR).optional(),
    workFrom: Joi.string().valid(WorkFrom.ONSITE, WorkFrom.HYBRID, WorkFrom.REMOTE).required(),
    type: Joi.string().valid(JobTypeEnum.CONTRACT, JobTypeEnum.FREELANCE, JobTypeEnum.FULL_TIME, JobTypeEnum.PART_TIME).required(),
  }),
};

export const getWithId = {
  params: Joi.object().keys({
    jobId: Joi.string().required(),
  }),
};

export const updateJob = {
  body: Joi.object()
    .keys({
      title: Joi.string().min(3).max(150).optional(),
      companyName: Joi.string().optional(),
      stack: Joi.array().items(Joi.string()).optional(),
      description: Joi.string().min(50).optional(),
      location: Joi.string().optional(),
      salary: Joi.number().positive().optional(),
      salaryCurrency: Joi.string().valid(SalaryCurrency.EUR, SalaryCurrency.GBP, SalaryCurrency.NGN, SalaryCurrency.USD).optional(),
      salaryPer: Joi.string().valid(SalaryPer.HOUR, SalaryPer.WEEK, SalaryPer.MONTH, SalaryPer.YEAR).optional(),
      workFrom: Joi.string().valid(WorkFrom.ONSITE, WorkFrom.HYBRID, WorkFrom.REMOTE).optional(),
      jobType: Joi.string()
        .valid(
          JobTypeEnum.CONTRACT,
          JobTypeEnum.FREELANCE,
          JobTypeEnum.FULL_TIME,
          JobTypeEnum.CONTRACT
        )
        .optional(),
    })
    .or(
      "title",
      "companyName",
      "stack",
      "description",
      "location",
      "salary",
      "salaryCurrency",
      "salaryPer",
      "workFrom",
      "jobType"
    ),
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
