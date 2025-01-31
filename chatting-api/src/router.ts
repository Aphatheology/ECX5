import { Router } from 'express';
import authRoute from './users/auth.route';
import userRoute from './users/user.route';
import chatRoute from './chats/chat.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use("/chats", chatRoute);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route Not Found' });
});

export default router;
