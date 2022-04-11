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
  setToken(res, token); // 토큰 데이터 쿠키에 저장
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
  setToken(res, token); // 토큰 데이터 쿠키에 저장
  res.status(200).json({ token, username });
  // header 안의 cookie header 로 token 데어터를 보내주지 않고
  // body 안에 token 데이터를 보내주는 이유?
  // -> cookie 는 브라우저에게 특화된 것이므로 브라우저 외의 다른 클라이언트는 cookie 를 사용할 수 없기 때문에
};

export async function logout(req, res, next) {
  setToken(res, '');
  res.status(200).json({ message: 'User has been logged out' });
}

// Set Jwt
async function createJwtToken(id) {
  return jwt.sign(
    {
      id,
    },
    config.jwt.secretKey,
    { expiresIn: config.jwt.expiresInSec }
  );
}

// Set Cookie (httpOnly)
function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000, // - 쿠키의 유효기간을 설정한다 (jwt 시간과 동일하게 해주면 좋다 / ms로 설정)
    httpOnly: true,   // - httpOnly 로 지정 (브라우저 자체적으로 쿠키를 보관, JavaScript 로 접근 불가)
    sameSite: 'none', // - CORS 와 비슷하게 클라이언트와 서버가 다른 도메인, 즉 다른 IP 이더라도 서로 동작할 수 있게끔 설정
    secure: true,     // - sameSite 가 지정되면 secure 를 true 로 지정해 주어야 한다. (https 가 아닌 http 에서는 미적용 해주어도 상관없다.)
  }
  res.cookie('token', token, options); // - options를 통해 그냥 cookie 가 아닌 httpOnly 쿠키를 지정한다.
}
// 브라우저 클라이언트에서 사용자에 대한 민감한 데이터를 localStorage 나 그냥 cookie 에 저장해 두는 것은 좋지 않습니다.
// 왜냐하면 XSS attack 의 script injection 로 인한 보안 이슈로 누군가 악의적으로 저장된 정보에 접근할 수 있기 때문입니다.
// 그래서 httpOnly 를 포함한 cookie 를 사용해야 보다 안전하게 데이터를 저장할 수 있습니다.
// 그치만 httpOnly 도 CSRF attack 으로 인한 보안 이슈가 있기 땨문에 완전히 안전한 방법이라 할 수 없다.
// ※ CSRF (Cross-Site Request Forgery) : 사용자가 특정한 액션을 하도록 만드는 공격.


export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

