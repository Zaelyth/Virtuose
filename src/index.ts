import { App } from './app';

const app = new App();
app
  .start()
  .then(() => {})
  .catch(error => {
    console.log(error);
  });
