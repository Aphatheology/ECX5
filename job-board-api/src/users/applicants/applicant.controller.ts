import { Response } from 'express';
import { CustomRequest } from 'middlewares/auth';
import catchAsync from 'utils/catchAsync';
import * as applicantService from './applicant.service';

export const updateApplicantProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const applicant = await applicantService.updateApplicantProfile(req.user, req.body);
  res.send(applicant);
});