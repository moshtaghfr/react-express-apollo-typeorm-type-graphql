import { InputType, Field } from 'type-graphql';

@InputType()
export default class CreateSessionInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}
