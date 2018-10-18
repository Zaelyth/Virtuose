import { ContextUser } from './contextUser.model';

export interface Context {
  request: any;
  user?: ContextUser;
}
