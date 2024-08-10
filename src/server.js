import express from 'express';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constant/index.js';

const PORT = Number(env('PORT', '3000'));
const allowedOrigins = [
  'http://localhost:3000',
  'https://fosssoft.github.io/project-04/',
];
const corsOptions = { origin: allowedOrigins, credentials: true };
export const setupServer = () => {
  const app = express();
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(router);
  app.use('*', notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
