import express, { Express } from 'express';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './utils/error';
import router from './router';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: config.frontendUrl,  
  credentials: true,
}));

app.options('*', cors());

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(express.json());

app.use('/api', router);

app.get("/v1", (req, res) => {
  res.send({ message: "Welcome to Aphatheology Chatting API" });
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "Route Not found" });
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
