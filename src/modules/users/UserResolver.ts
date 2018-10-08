import { Resolver, Mutation, Args } from 'type-graphql';
import { User } from '../../entities/User';
import { CreateUserArgs } from './CreateUserArgs';

@Resolver(User)
class UserResolver {
  constructor() {}

  @Mutation(returns => User)
  async createUser(@Args() { email, password, nickname }: CreateUserArgs) {
    const user = User.create();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    return await user.save();
  }
}
