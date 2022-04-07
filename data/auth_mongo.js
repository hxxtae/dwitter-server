import MongoDB from 'mongodb';
import { getUsers } from '../db/mongo.js';

// ---------------------------------
// [ MVC ( Model ) ]
// ---------------------------------

// MongoDB 조회
// 1. 해당 Collection을 가져온다.
// 2. findOne() 을 사용해 데이터를 가져온다.

export async function findByUsername(username) {
  return getUsers()
    .findOne({ username })
    .then(mapOptionalUser);
};

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalUser);
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
};
// insert 결과 출력 -> data
// {
//   acknowledged: true,
//   insertedId: new ObjectId("624e71e8e3cc970768008bac")
// }
// -> 생성된 id 를 반환

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
