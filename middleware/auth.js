import jwt from 'jsonwebtoken';

import * as userRepository from '../data/auth_mongo.js';
import { config } from '../config.js'

const AUTH_ERROR = { message: 'Authorization' };

export const isAuth = async (req, res, next) => {
  let token;

  // 1. check the header first (not used)
  const authHeader = req.get('Authorization');
  if ((authHeader && authHeader.startsWith('Bearer'))) {
    token = authHeader.split(' ')[1];
  }
  // 클라이언트에서 header 에 Authorization: `Bearer ${token}` 값을 넘겨주어야 한다.
  // 하지만 cookie 를 사용하고 나서 부터는 더이상 사용하지 않는다.

  // 2. check the cookie second
  if (!token) {
    token = req.cookies['token'];
  }

  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  // TODO: Make it secure!
  jwt.verify(
    token,
    config.jwt.secretKey,
    async (error, decoded) => { // decoded : secret 키로 token 을 인증하면 받는 값
      if (error) {
        return res.status(401).json(AUTH_ERROR);
      }
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      req.userId = user.id; // req.customData (request에 사용자 지정 데이터를 추가할 수 있다.)
      req.token = token;
      next();
    }
  )
  
}