import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import CreateWilderInput from '../inputs/CreateWilderInput';
import Wilder from '../models/Wilder';

@Resolver()
export default class WilderResolver {
  @Query(() => [Wilder])
  wilders(): Promise<Wilder[]> {
    return Wilder.find();
  }

  @Mutation(() => Wilder)
  async createWilder(@Arg('input') input: CreateWilderInput): Promise<Wilder> {
    const wilder = Wilder.create(input);
    await wilder.save();
    return wilder;
  }
}
