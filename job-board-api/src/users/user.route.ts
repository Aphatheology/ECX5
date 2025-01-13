import express, { Router } from "express";
import validate from "../middlewares/validate";
import * as userValidation from "./user.validation";
import * as userController from "./user.controller";
import * as employerController from "./employers/employer.controller";
import * as applicantController from "./applicants/applicant.controller";
import auth from '../middlewares/auth';

const router: Router = express.Router();

router
  .route("/")
  .get(auth(), userController.getProfile);

router
    .route("/employer")
    .patch(auth(['employer']), validate(userValidation.updateEmployerProfile), employerController.updateEmployerProfile);

router
    .route("/applicant")
    .patch(auth(['applicant']), validate(userValidation.updateApplicantProfile), applicantController.updateApplicantProfile);

export default router;
