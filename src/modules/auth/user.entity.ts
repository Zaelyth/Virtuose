import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Authorized } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  password: string;

  @Authorized('ADMIN')
  @Field(type => [String])
  @Column('text', { array: true, default: '{"USER"}' })
  roles: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;
}
