import { ConnectionOptions } from 'typeorm';
import { Options } from 'graphql-yoga';

export const variables = {
  server: <Options>{
    port: process.env.port || 4000,
    endpoint: '/',
    playground: '/playground'
  },
  typeorm: <ConnectionOptions>{
    type: 'postgres',
    host: 'HOST',
    port: 5432,
    username: 'USERNAME',
    password: 'PASSWORD',
    database: 'DATABASE',
    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts', 'src/modules/**/*.entity.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts']
  }
};
