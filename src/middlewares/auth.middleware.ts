import * as jwt from 'express-jwt';

export default jwt({ secret: 'MaCutiePie', credentialsRequired: false });
