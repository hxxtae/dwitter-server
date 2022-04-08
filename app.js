import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { Server } from 'socket.io';

import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { connectDB } from './db/mongo.js';

const app = express();
const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

// 기본 미들웨어 설정
app.use(express.json());
app.use(cors(corsOption));
app.use(helmet());
app.use(morgan('tiny'));

// Route(tweets)
app.use('/tweets', tweetsRouter);
// Route(Auth)
app.use('/auth', authRouter);

// 404 Error
app.use((req, res, next) => {
  res.sendStatus(404);
});

// Error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send('Server Error');
});

// [ MongoDB ]
connectDB().then(() => {
  const server = app.listen(config.port);
  if (server) {
    console.log('server start !!!!');
  }
}).catch(console.error);

// [ Socket IO ]
// const server = app.listen(config.port);
// const socketIO = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// socketIO.on('connection', (socket) => {
//   console.log('Client is here!');
//   socketIO.emit('dwitter', 'Hello~!1');
//   socketIO.emit('dwitter', 'Hello~!2');
// });


