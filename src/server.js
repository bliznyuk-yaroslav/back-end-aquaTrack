import express from 'express';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(router);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
