import { Response } from 'express';
import { CustomRequest } from 'middlewares/auth';
import catchAsync from 'utils/catchAsync';
import * as employerService from './employer.service';

export const updateEmployerProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const employer = await employerService.updateEmployerProfile(req.user, req.body);
  res.send(employer);
});