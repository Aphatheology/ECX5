require('dotenv').config();
import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';

const startServer = async () => {
	try {
		await mongoose.connect(config.mongoose.url);
		app.listen(config.port);
        logger.info(`Db connected and app listening on port ${config.port}`)
	} catch (error) {
		logger.error(error);
	}
};

startServer();
