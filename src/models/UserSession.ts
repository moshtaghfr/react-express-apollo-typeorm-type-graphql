import {
  Column,
  Generated,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Wilder from './Wilder';

@Entity()
@ObjectType()
export default class UserSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Index()
  @Column()
  @Generated('uuid')
  uuid!: string;

  @ManyToOne(() => Wilder)
  user!: Wilder;
}
