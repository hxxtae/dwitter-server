// DataBase is MySQL
// import * as tweetRepository from '../data/tweet.js';

// DataBase is MongoDB
import * as tweetRepository from '../data/tweet_mongo.js';

// ---------------------------------
// [ MVC ( Controller ) ]
// ---------------------------------
// - server 에서의 Controller
// - 비즈니스 로직이 변경되어야 한다면 Controller 에서만 변경해 주면 된다.
// - 메모리

export async function getTweets(req, res, next) {
  const username = req.query.username;
  const tweet = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(tweet);
}

export async function getTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({message: `Tweet id(${id}) not found`});
  }
  res.status(200).json(tweet);
}

export async function createTweet(req, res, next) {
  const { text } = req.body;
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
}

export async function updateTweet(req, res, next) {
  const text = req.body.text;
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({message: `Tweet id(${id}) not found`});
  }
  // 다른 사용자 수정 방지
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await tweetRepository.update(text, id);
  res.status(200).json(updated);
}

export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({message: `Tweet id(${id}) not found`});
  }
  // 다른 사용자 삭제 방지
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const deleted = await tweetRepository.remove(id);
  res.status(204).json(deleted);
}
