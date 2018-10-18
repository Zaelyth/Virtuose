import {
  Resolver,
  Mutation,
  Args,
  Query,
  Arg,
  Authorized,
  Ctx
} from 'type-graphql';
import { User } from './user.entity';
import { RegisterArgs } from './register.args';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Context } from '../../models/context.model';

@Resolver()
export class UserResolver {
  @Authorized('ADMIN')
  @Query(returns => [User])
  async users() {
    return await User.find();
  }

  @Authorized('ADMIN')
  @Query(returns => User)
  async user(@Arg('id') id: string) {
    return await User.findOne({ id });
  }

  @Authorized()
  @Query(returns => User)
  async me(@Ctx() context: Context) {
    return await User.findOne({ username: context.user.username });
  }

  @Query(returns => String)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.findOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return jwt.sign(
          {
            username: user.username,
            roles: user.roles
          },
          'test'
        );
      } else {
        throw 'Invalid password';
      }
    } else {
      throw 'Invalid user';
    }
  }

  @Mutation(returns => User)
  async register(@Args() { email, password, username }: RegisterArgs) {
    const userCount = await User.count();
    const user = User.create();
    user.email = email;
    user.password = await bcrypt.hash(password, 12);
    user.username = username;
    // The first created account is the admin
    user.roles = userCount > 0 ? ['USER'] : ['ADMIN'];
    return await user.save();
  }
}
