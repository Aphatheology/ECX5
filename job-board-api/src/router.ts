import { Router } from 'express';
import jobRoute from './jobs/job.route';
import authRoute from './users/auth.route';
import userRoute from './users/user.route';
import applicationRoute from './applications/application.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/jobs', jobRoute);
router.use('/app', applicationRoute);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route Not Found' });
});

export default router;
