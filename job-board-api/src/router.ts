import { Router } from 'express';
import userRoute from './users/user.route';

const router = Router();

router.use('/auth', userRoute);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route Not Found' });
});

export default router;
