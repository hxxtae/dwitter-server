// MongoDB Node Driver
// -> MongoDB 와 Nodejs를 연결해 주는 중간 다리를 driver 라고하며
//    이와 롼련된 api를 제공한다.

// MongoDB Connection
import MongoDB from 'mongodb';
import { config } from '../config.js';

let db;
export async function connectDB() {
  return MongoDB.MongoClient.connect(config.mongo.host)
    .then((client) => {
      db = client.db();
    });
}

// mongoDB 에서 users 의 Collection 정보를 가져온다.
export function getUsers() {
  return db.collection('users'); // users 이름은 MongoDB Atlas에서 자동으로 대문자로 변경된다.
}

// mongoDB 에서 tweets 의 Collection 정보를 가져온다.
export function getTweets() {
  return db.collection('tweets');
}
