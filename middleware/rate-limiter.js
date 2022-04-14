import rateLimit from 'express-rate-limit';

import { config } from '../config.js';

// 호출 시 middleware callback 함수 반환
export default rateLimit({
  windowMs: config.rateLimit.windowMs, // ms 단위만 가능하다.
  max: config.rateLimit.maxRequest, // 위 시간동안 처리가능한 요청 개수 (요청이란 GET, POST, PUT, DELETE 등의 요청을 말한다.)
  keyGenerator: (req, res) => 'dwitter-limit',
});
