import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';

export enum TrainingType {
  FULL_TIME = 'FULL_TIME',
  WORK_AND_STUDY = 'WORK_AND_STUDY',
}
registerEnumType(TrainingType, { name: 'TrainingType' });

@Entity()
@ObjectType()
export default class Wilder extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field(() => String)
  firstName!: string;

  @Column()
  @Field(() => String)
  lastName!: string;

  @Column({ default: '' })
  @Field(() => String)
  city!: string;

  @Column({ default: TrainingType.FULL_TIME })
  @Field(() => TrainingType)
  trainingType!: TrainingType;
}
