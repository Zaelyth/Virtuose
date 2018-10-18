import { Field, ArgsType } from 'type-graphql';
import { User } from './user.entity';

@ArgsType()
export class RegisterArgs implements Partial<User> {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => String, { nullable: true })
  username?: string;
}
