import express from 'express';
import 'express-async-errors';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as tweetController from '../controller/tweet.js';
import { validate as validation } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

// ※ import 작성 순서는 외부 라이브러리 먼저 그리고 우리 프로젝트 순으로 작성

// ---------------------------------
// [ MVC ( View ) ]
// ---------------------------------
// - server 에서의 view

const router = express.Router();

// validation
// sanitization
// Contract Testing: Client-Server (공부해 보면 좋음)
const validateTweet = [
  body('text').trim().isLength({ min: 3 }).withMessage('text should be at least 3 characters'),
  validation
];

// GET /tweets
// GET /tweets?username=:username
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet);

// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

// 404 Error
router.use((req, res, next) => {
  res.sendStatus(404);
});

export default router;

// [ Request property ]
// - req.params
// - req.query
// - req.body


// [ express validation 라이브러리 ]
// - express validation 사용과 함께 Sanitization 도 함께 사용해야 더 확실한 validate가 가능하다.
//   Sanitization : 공백 제거나 소문자로 변경, 대문자로 변경, 객체형태로 변환 등 기타 작업을을 말한다.
// ex)
/*
  body
  {
    "name": "Ellie",
    "age": 12,
    "job": {
      "name": "Developer",
      "title": "Instructor"
    },
    "email": "fkdlxmfkdl@google.com"
  }
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) { // validation 결과가 true 이면 정상, false 이면 validation 에러 확인
    return next();
  }
  // 클라이언트에게 모든 에러 항목을 줄 때
  res.status(400).json({ message: errors.array() });
  // 클라이언트에게 하나의 에러 항목을 줄 때
  //res.status(400).json({ message: errors.array()[0].msg });
};

router.post(
  '/users',
  [
    body('name').trim().isLength({ min: 2, max: 10 }).withMessage('이름은 두글자 이상'),
    body('age').isInt().withMessage('숫자를 입력하세요'),
    body('email').isEmail().withMessage('이메일을 입력하세요').normalizeEmail(),
    body('job.name').notEmpty(),
    validate,
  ],
  (req, res, next) => {
    res.sendStatus(201);
  }
);

router.get(
  '/:email',
  [
    param('email').isEmail().withMessage('이메일을 입력하세요'),
    validate
  ],
  (req, res, next) => {
    res.send('success');
  }
);

// check -> 모든 값 검사
// body
// cookie
// header
// param
// query

// --------------------------------------

// [ Authentication ]
// - 인증, 로그인

// [ Session & Cookies ]
//

// [ JWT ]
// - (= JSON Web Token)
// - npm i jsonwebtoken
// - 공식 문서 : https://jwt.io/
// - 자동 패스워드 생성 사이트(무료) : https://passwordsgenerator.net/kr/
/*
import jwt from 'jsonwebtoken';

// 1. 패스워드와 Payload 로 토큰 생성
const secret = 'JXr5PaA@%Nu!FCJbh_CV^yy&AA@gtK7D';
const token = jwt.sign(
  {
    id: 'ellie',
    isAdmin: false,
  },
  secret,
  { expiresIn: 2 }
);

// 2. 생성된 토큰과 패스워드로 유효한 토큰 확인
const result = jwt.verify(token, secret, (error, decoded) => {
  console.log(error, decoded);
});
console.log(result);
*/


// [ bcrypt ]
// - password-hashing function
// - 암호를 hashing 할 수 있는 알고리즘
// - 단방향이다 (암호를 암호화만 하고 복호화는 안된다.)
// - Salt 길이별로 성능 측정 : https://auth0.com/blog/hashing-in-action-understanding-bcrypt/#-bcrypt--Best-Practices
// - npm i bcrypt
/*
import bcrypt from 'bcrypt';

const password = 'abc1234';
// 동기 방식 암호화
const hashed = bcrypt.hashSync(password, 10); // (해시로 변경할 비번, 암호화 정도)
console.log(`password: ${password}, hashed: ${hashed}`);
// 암호화 정도는 보통 8 ~ 12 사이로 지정하며, 너무 높은 값을 지정하면
// 높은 암호화 게산으로 많은 시간과 리소스가 소모된다.

// 비동기 방식 암호화
//const hashed = bcrypt.hash(password, 10);
//console.log(`password: ${password}, hashed: ${hashed}`);

// 동기 방식 (암호화 - 패스워드) 확인
const result = bcrypt.compareSync(password, hashed);
console.log(result); // 맞으면 true, 틀리면 false

// 비동기 방식 (암호화 - 패스워드) 확인
//const result = bcrypt.compare(password, hashed);
//console.log(result);

*/

// [ Configuration ]
// 환경변수에서 중요한 값이나 변수 값의 변경이 용이하도록 사용 됨.

// [ SQL ] : 관계형
// - 조인 쿼리의 성능이 좋기때문에 사용
// - 수직적 데이터 확장

// [ NoSQL ] : 정보의 중복 > 관게
// - 관계형 조인 쿼리의 성능이 좋지 않다.
// - 관계형 보다 정보를 전부 가지고 있는게 휠씬 성능이 좋다.
// - 수평적 데이터 확장
// - 서버1, 서버2, 서버3 .. 처럼 분산하여 데이터를 저장하고 관리하기가 용이하다.

// [ ORM (Object Relational Mapping) ]
// -> Objects <- ORM -> Tables

// [ ODM (Object Document Mapper) ]

// Q. SQL vs NoSQL : How to choose?
// 1. The type of data in question
//    -> 데이터의 타입들이 어떤지 생각해 봐야 한다.
// 2. The amount of data
//    -> 데이터의 양은 어떤지 생각해 봐야 한다.
// 3. How data will be queried?
//    -> 데이터 끼리 관계가 있는지, 얼마나 많은지 생각해 봐야 한다.

// SQL이 사용되는 비즈니스
// - Accounting Software
// - E-commerce platforms
// - customer Relationship software (CRM)

// NoSQL이 사용되는 비즈니스
// - Social Networks (Graph)
// - Distributed cache (key-value)
// - content Management Systems (Document)
// - Real-time analytics (wide-column)

