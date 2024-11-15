import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

export default {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    dialect: 'postgres',
  },
  jwt: process.env.JWT_SECRET,
};
