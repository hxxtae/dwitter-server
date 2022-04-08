import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'express-async-errors';

import * as userRepository from '../data/auth_mongo.js';

import { config } from '../config.js';

// ---------------------------------
// [ MVC ( Controller ) ]
// ---------------------------------

export async function signup(req, res, next) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });

  // [ 토큰 데이터 생성 조건 ]
  // Database 에서 유저 확인 후 존재하면 -> Token 데이터 생성
  // Database 에서 유저 확인 후 존재하지 않으면 -> 에러 메세지
  const token = await createJwtToken(userId);
  res.status(201).json({ token, username });
};

export async function login(req, res, next) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: `Invalid user or password` });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `invalid user or password` });
  }

  // [ 토큰 데이터 생성 조건 ]
  // Database 에서 유저 확인 후 존재하면 -> Token 데이터 생성
  // Database 에서 유저 확인 후 존재하지 않으면 -> 에러 메세지
  const token = await createJwtToken(user.id);
  res.status(200).json({ token, username });
};


async function createJwtToken(id) {
  return jwt.sign(
    {
      id,
    },
    config.jwt.secretKey,
    { expiresIn: config.jwt.expiresInSec }
  );
}


export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

