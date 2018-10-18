import { Resolver, Mutation, Args, Query, Arg } from 'type-graphql';
import { User } from './user.entity';
import { RegisterArgs } from './register.args';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  @Query(returns => [User])
  async users() {
    return await User.find();
  }

  @Query(returns => User)
  async user(@Arg('id') id: string) {
    return await User.findOne({ id });
  }

  @Query(returns => String)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.findOne({ email });
    if (user) {
      try {
        if (await bcrypt.compare(password, user.password)) {
          return jwt.sign(
            {
              username: user.username,
              roles: user.roles
            },
            'MaCutiePie'
          );
        }
      } catch (error) {
        throw 'Password';
      }
    } else {
      throw 'USER GRRRR';
    }
    return await User.findOne({ email });
  }

  @Mutation(returns => User)
  async register(@Args() { email, password, username }: RegisterArgs) {
    const user = User.create();
    user.username = username;
    user.email = email;
    user.password = await bcrypt.hash(password, 12);
    return await user.save();
  }
}
