import {
  Resolver,
  Mutation,
  Args,
  Query,
  Arg,
  Authorized,
  Ctx
} from 'type-graphql';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from './user.entity';
import { RegisterArgs } from './register.args';
import { Context } from '../../models/context.model';
import { AuthService } from './auth.service';

@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  @Authorized('ADMIN')
  @Query(returns => [User])
  async users() {
    return await this.userRepository.find();
  }

  @Authorized('ADMIN')
  @Query(returns => User)
  async user(@Arg('id') id: string) {
    return await this.userRepository.findOne({ id });
  }

  @Authorized()
  @Query(returns => User)
  async me(@Ctx() context: Context) {
    return await this.userRepository.findOne({
      username: context.user.username
    });
  }

  @Query(returns => String)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return this.authService.createToken(user.username, user.roles);
      } else {
        throw 'Invalid password';
      }
    } else {
      throw 'Invalid user';
    }
  }

  @Mutation(returns => User)
  async register(@Args() { email, password, username }: RegisterArgs) {
    const userCount = await this.userRepository.count();
    const user = this.userRepository.create();
    user.email = email;
    user.password = await bcrypt.hash(password, 12);
    user.username = username;
    // The first created account is the admin
    user.roles = userCount > 0 ? ['USER'] : ['ADMIN'];
    return await this.userRepository.save(user);
  }
}
