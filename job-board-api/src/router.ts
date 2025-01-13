import { Router } from 'express';
import jobRoute from './jobs/job.route';
import authRoute from './users/auth.route';
import userRoute from './users/user.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/jobs', jobRoute);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route Not Found' });
});

export default router;
