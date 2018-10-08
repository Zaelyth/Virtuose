import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateUserArgs {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => String, { nullable: true })
  nickname?: string;
}
