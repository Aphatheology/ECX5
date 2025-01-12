import express, { Router } from 'express';
import validate from '../middlewares/validate';
import * as jobController from './job.controller';
import * as jobValidation from './job.validation'
import auth from '../middlewares/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth, validate(jobValidation.createJob), jobController.createJob)
  .get(jobController.getJobs);

router
  .route('/mine')
  .get(auth, jobController.getMyJobs);

router
  .route('/:jobId')
  .get(validate(jobValidation.getWithId), jobController.getJob)
  .put(auth, validate(jobValidation.updateJob), jobController.updateJob)
  .delete(auth, validate(jobValidation.getWithId), jobController.deleteJob);

  router
  .route('/:jobId/:jobStatus')
  .patch(auth, validate(jobValidation.updateJobStatus), jobController.updateJobStatus);


export default router;