import express, { Router } from 'express';
import validate from '../middlewares/validate';
import * as urlController from './url.controller';
import * as urlValidation from './url.validation'
import auth from '../middlewares/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth, validate(urlValidation.createShortUrl), urlController.createShortUrl)
  .get(auth, urlController.getMyUrls);

router
  .route('/:shortUrl')
  .get(validate(urlValidation.getUrl), urlController.getUrl)
  .delete(auth, validate(urlValidation.getUrl), urlController.deleteUrl);

export default router;