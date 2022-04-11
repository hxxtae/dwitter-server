import MongoDB from 'mongodb';
import { getTweets } from '../db/mongo.js';
import * as userReository from '../data/auth_mongo.js';

// ---------------------------------
// [ MVC ( Model ) ]
// ---------------------------------
// - server 에서의 model
// - 데이터의 로직이 변경되어야 한다면 Model 에서만 변경해 주면 된다.
// - 데이터베이스

// 다건
// find() 는 커서(cursor) 형태로 데이터를 하나 하나씩 읽어온다.
// sort() 는 정렬 방식으로 해당 데이터에 양수면 오름차순, 음수면 내림차순.
export async function getAll() {
  return getTweets()
    .find()
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

// 다건
export async function getAllByUsername(username) {
  return getTweets()
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

// 단건
// 단건은 find() 가 아닌 findOne() 을 사용해야 한다.
export async function getById(id) {
  return getTweets()
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  const { username, name, url } = await userReository.findById(userId);
  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    username,
    name,
    url
  }
  return getTweets()
    .insertOne(tweet)
    .then((data) => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

// updateOne() : void
// -> 업데이트를 하고 아무 값도 받아오지 않는다면
// findOneAndUpdate() : object
// -> 업데이트를 하고 반환 값을 받아온다면
export async function update(text, id) {
  return getTweets()
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) }, // 업데이트할 대상 선택
      { $set: { text } },
      { returnDocumnet: 'after' } // before: 업데이트 이전 값 반환, after: 업데이트 이후 값 반환
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets()
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}

