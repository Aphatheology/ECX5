import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import * as applicationValidation from './application.validation';
import * as applicationController from './application.controller';

const router = express.Router();

router
  .route('/:jobId')
  .post(auth(['applicant']), validate(applicationValidation.applyForJob), applicationController.applyForJob);

router
  .route('/job/:jobId')
  .get(auth(['employer']), validate(applicationValidation.getApplications), applicationController.getJobApplications);

router
  .route('/')
  .get(auth(['applicant']), applicationController.getMyApplications);

  router
  .route('/:applicationId/status')
  .patch(auth(['employer']), validate(applicationValidation.updateApplicationStatus), applicationController.updateApplicationStatus);

export default router;
