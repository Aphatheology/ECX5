import { Response } from 'express';
import { CustomRequest } from 'middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import * as applicantService from './applicant.service';
import { StatusCodes } from 'http-status-codes';

export const updateApplicantProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const applicant = await applicantService.updateApplicantProfile(req.user, req.body);
  res.send(applicant);
});

export const getApplicantProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const applicant = await applicantService.getApplicantProfile(req.user);
  res.send(applicant);
});

export const uploadResume = catchAsync(async (req: CustomRequest, res: Response) => {
  const resume = await applicantService.uploadResume(req.user, req.body, req.file);
  res.send(resume);
});

export const getApplicantResumes = catchAsync(async (req: CustomRequest, res: Response) => {
  const applicant = await applicantService.getApplicantResumes(req.user);
  res.send(applicant);
});

export const updateResumeTag = catchAsync(async (req: CustomRequest, res: Response) => {
  const applicant = await applicantService.updateResumeTag(req.user, req.params?.id, req.body?.tag);
  res.send(applicant);
});

export const deleteResume = catchAsync(async (req: CustomRequest, res: Response) => {
  await applicantService.deleteResume(req.user, req.params?.id);
  res.sendStatus(StatusCodes.NO_CONTENT);
});