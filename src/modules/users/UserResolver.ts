import { Resolver, Mutation, Args } from 'type-graphql';
import { User } from '../../entities/User';
import { CreateUserInput } from './CreateUserInput';

@Resolver(User)
export class UserResolver {
  constructor() {}

  @Mutation(returns => User)
  async createUser(@Args() { email, password, nickname }: CreateUserInput) {
    const user = User.create();
    user.nickname = nickname;
    user.email = email;
    user.password = password;
    return await user.save();
  }
}
