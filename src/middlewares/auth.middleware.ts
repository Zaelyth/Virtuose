import * as jwt from 'express-jwt';

export default jwt({ secret: 'test', credentialsRequired: false });
