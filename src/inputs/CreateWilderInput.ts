import { MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { TrainingType } from '../models/Wilder';

@InputType()
export default class CreateWilderInput {
  @Field()
  @MaxLength(25)
  firstName!: string;

  @Field()
  @MaxLength(25)
  lastName!: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => TrainingType, { nullable: true })
  trainingType?: TrainingType;
}
