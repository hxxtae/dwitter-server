import { db } from '../db/database.js';

// ---------------------------------
// [ MVC ( Model ) ]
// ---------------------------------
// - server 에서의 model
// - 데이터의 로직이 변경되어야 한다면 Model 에서만 변경해 주면 된다.
// - 데이터베이스

const SELECT_JOIN = 'SELECT T1.id AS id, T1.userId AS userId, T1.text AS text, T1.createdAt AS createdAt, T2.username AS username, T2.name AS name, T2.url AS url FROM dwitter.tweets T1 JOIN dwitter.users T2 ON T1.userId = T2.id';
const ORDER_DESC = 'ORDER BY CREATEDAT DESC';
// Auths 데이터와 Tweets 데이터 Join 헤서 출력 데이터 가공하기
// 다건
export async function getAll() {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`)
    .then((result) => result[0]);
}

// 다건
export async function getAllByUsername(username) {
  return db
    .execute(`${SELECT_JOIN} WHERE T2.username = ? ${ORDER_DESC}`, [username])
    .then((result) => result[0]);
}

// 단건
export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE T1.id = ?`, [id])
    .then((result) => result[0][0]);
}

export async function create(text, userId) {
  return db
    .execute(`INSERT INTO dwitter.tweets (text, createdAt, userId) VALUES (?, ?, ?)`, [text, new Date(), userId])
    .then((result) => getById(result[0].insertId));
}


export async function update(text, id) {
  return db
    .execute('UPDATE dwitter.tweets SET text = ? WHERE id = ?', [text, id])
    .then(() => getById(id));
}

export async function remove(id) {
  return db
    .execute('DELETE FROM dwitter.tweets WHERE id = ?', [id])
    .then(() => getById(id));
}
