import { db } from '../db/database.js';

// ---------------------------------
// [ MVC ( Model ) ]
// ---------------------------------

export async function findByUsername(username) {
  return db
    .execute('SELECT * FROM dwitter.users WHERE USERNAME = ?', [username])
    .then((result) => result[0][0]); // users 단건 데이터 출력
};


export async function findById(id) {
  return db
    .execute('SELECT * FROM dwitter.users WHERE ID = ?', [id])
    .then((result) => result[0][0]); // users 단건 데이터 출력
}

export async function createUser(user) {
  const { username, password, name, email, url } = user;
  return db
    .execute(
      'INSERT INTO dwitter.users (username, password, name, email, url) VALUES (?, ?, ?, ?, ?) ',
      [username, password, name, email, url]
    )
    .then((result) => result[0].insertId); // userId 단건 데이터 출력
};


