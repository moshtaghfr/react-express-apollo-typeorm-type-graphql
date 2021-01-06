import { hash } from 'bcrypt';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import UserSession from './UserSession';

export const DEFAULT_CITY = '';
export enum TrainingType {
  FULL_TIME = 'FULL_TIME',
  WORK_AND_STUDY = 'WORK_AND_STUDY',
}
registerEnumType(TrainingType, { name: 'TrainingType' });
export const DEFAULT_TRAINING_TYPE = TrainingType.FULL_TIME;

export const getDisplayName = (
  firstName: string,
  lastName: string,
  city = DEFAULT_CITY,
  trainingType = DEFAULT_TRAINING_TYPE
): string => {
  const cityCode: Record<string, string> = {
    Paris: 'PAR',
    R1S: 'R1S',
    Strasbourg: 'SXB',
  };

  return `[${cityCode[city] || city || '?'}${
    trainingType === TrainingType.WORK_AND_STUDY ? ' – WnS' : ''
  }] ${firstName} ${lastName}`;
};

@Entity()
@ObjectType()
export default class Wilder extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column({ unique: true })
  @Field(() => String)
  username!: string;

  @Column()
  password!: string;

  @Column()
  @Field(() => String)
  firstName!: string;

  @Column()
  @Field(() => String)
  lastName!: string;

  @Column({ default: DEFAULT_CITY })
  @Field(() => String)
  city!: string;

  @Column({ default: DEFAULT_TRAINING_TYPE })
  @Field(() => TrainingType)
  trainingType!: TrainingType;

  @Column()
  @Field(() => String)
  displayName!: string;

  @BeforeInsert()
  setDisplayName(): void {
    this.displayName = getDisplayName(
      this.firstName,
      this.lastName,
      this.city,
      this.trainingType
    );
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}

export async function getUserFromSessionId(
  sessionId: string
): Promise<Wilder | null> {
  const userSession = await UserSession.findOne(
    { uuid: sessionId },
    { relations: ['user'] }
  );
  const user = userSession ? userSession.user : null;
  return user;
}
