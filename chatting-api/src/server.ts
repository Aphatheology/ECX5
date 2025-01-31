require('dotenv').config();
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';
import socketHandler from "./socket";

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url);

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    console.log("Socket.io server initialized"); 

    socketHandler(io);

    // const server = app.listen(config.port, () => {
    //   logger.info(`Db connected and app listening on port ${config.port}`);
    // });

    httpServer.listen(config.port, () => {
      logger.info(`Db connected and server listening on port ${config.port}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down...');
      await mongoose.disconnect();
      httpServer.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
