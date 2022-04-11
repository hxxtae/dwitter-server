import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { connectDB } from './db/mongo.js';

const app = express();
const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
  // -> 서버에서 response를 보낼 때, 꼭 브라우저에서 보낸 Access-Control-Allow-Credentials 를 포함해야
  //    브라우저가 서버로 부터 데이터를 받았을 때 클라이언트의 JavaScript 로 body 안의 데이터를 보내줄 수 있기 때문이다.
};

// 기본 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
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


