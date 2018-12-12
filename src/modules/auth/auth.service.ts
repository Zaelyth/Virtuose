import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { variables } from '../../environments/environment';
import { ContextUser } from '../../models/contextUser.model';

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

export function getUserFromHeader(header: string): ContextUser | null {
  const data = header.split(' ');
  return data && data.length > 1 ? <ContextUser>jwt.verify(data[1], variables.app.secret) : null;
}
