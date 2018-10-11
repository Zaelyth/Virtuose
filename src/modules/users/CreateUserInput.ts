import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => String, { nullable: true })
  nickname?: string;
}
