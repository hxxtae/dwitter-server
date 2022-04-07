import mysql from 'mysql2';

import { config } from '../config.js';

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

// 데이터베이스 연결을 비동기 적으로 연결
export const db = pool.promise();
