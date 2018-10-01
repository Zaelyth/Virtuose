import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
  .then(async connection => {
    console.log('toast');
  })
  .catch(error => console.log(error));
