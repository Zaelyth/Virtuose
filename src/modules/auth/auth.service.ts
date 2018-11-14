import * as middlware from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { variables } from '../../environments/environment';

@Service()
export class AuthService {
  createToken(username: string, roles: string[]): string {
    return jwt.sign(
      {
        username,
        roles
      },
      variables.app.secret
    );
  }
}

export const authMiddleware = middlware({
  secret: variables.app.secret,
  credentialsRequired: false
});
