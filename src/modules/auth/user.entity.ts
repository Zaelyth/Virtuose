import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  username?: string;

  @Field()
  @Column()
  password: string;

  @Field(type => [String])
  @Column('text', { array: true, default: '{"USER"}' })
  roles: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;
}
