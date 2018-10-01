import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  nickname?: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
