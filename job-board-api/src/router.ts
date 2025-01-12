import { Router } from 'express';
import jobRoute from 'jobs/job.route';
import userRoute from 'users/auth.route';

const router = Router();

router.use('/auth', userRoute);
router.use('/jobs', jobRoute);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route Not Found' });
});

export default router;
