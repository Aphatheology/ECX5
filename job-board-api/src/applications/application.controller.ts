import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as applicationService from './application.service';
import catchAsync from '../utils/catchAsync';
import { CustomRequest } from 'middlewares/auth';

export const applyForJob = catchAsync(async (req: CustomRequest, res: Response) => {
  const application = await applicationService.applyForJob(req.user, req.params.jobId, req.body.resumeId);
  res.status(StatusCodes.CREATED).send(application);
});

export const getJobApplications = catchAsync(async (req: CustomRequest, res: Response) => {
  const applications = await applicationService.getJobApplications(req.user, req.params.jobId, req.query);
  res.status(StatusCodes.OK).send(applications);
});

export const getMyApplications = catchAsync(async (req: CustomRequest, res: Response) => {
  const applications = await applicationService.getMyApplications(req.user);
  res.status(StatusCodes.OK).send(applications);
});

export const updateApplicationStatus = catchAsync(async (req: CustomRequest, res: Response) => {
  const application = await applicationService.updateApplicationStatus(req.params.applicationId, req.body.status);
  res.status(StatusCodes.OK).send(application);
});
