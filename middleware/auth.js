import jwt from 'jsonwebtoken';

// DataBase is MySQL
import * as userRepository from '../data/auth.js';

// DataBase is MongoDB
//import * as userRepository from '../data/auth_mongo.js';

import { config } from '../config.js'

const AUTH_ERROR = { message: 'Authorization' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(' ')[1];

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