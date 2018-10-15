import { Resolver, Mutation, Args, Query, Arg } from 'type-graphql';
import { User } from './user.entity';
import { RegisterArgs } from './register.args';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  @Query(returns => [User])
  async users() {
    return await User.find();
  }

  @Query(returns => User)
  async user(@Arg('id') id: string) {
    return await User.find({ id });
  }

  @Mutation(returns => User)
  async register(@Args() { email, password, nickname }: RegisterArgs) {
    const user = User.create();
    user.nickname = nickname;
    user.email = email;
    user.password = await bcrypt.hash(password, 12);
    return await user.save();
  }
}
