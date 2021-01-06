import { compare } from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';

import CreateSessionInput from '../inputs/CreateSessionInput';
import CreateWilderInput from '../inputs/CreateWilderInput';
import UserSession from '../models/UserSession';
import Wilder from '../models/Wilder';

@Resolver()
export default class WilderResolver {
  @Query(() => [Wilder])
  wilders(): Promise<Wilder[]> {
    return Wilder.find();
  }

  @Query(() => Wilder)
  me(@Ctx() { user }: { user: Wilder | null }): Wilder {
    if (!user) {
      throw Error('You are not authenticated.');
    }
    return user;
  }

  @Mutation(() => Wilder)
  async createWilder(@Arg('input') input: CreateWilderInput): Promise<Wilder> {
    const wilder = Wilder.create(input);
    await wilder.save();
    return wilder;
  }

  @Mutation(() => Wilder)
  async createSession(
    @Arg('input') input: CreateSessionInput,
    @Ctx()
    { setSessionIdCookie }: { setSessionIdCookie: (id: string) => void }
  ): Promise<Wilder> {
    const { username, password } = input;
    const user = await Wilder.findOne({ username });
    const authenticationError = new Error(
      'Incorrect username and/or password.'
    );
    if (!user) {
      throw authenticationError;
    }
    const isPasswordMatching = await compare(password, user.password);
    if (!isPasswordMatching) {
      throw authenticationError;
    }
    const userSession = UserSession.create({ user });
    await userSession.save();
    setSessionIdCookie(userSession.uuid);
    return user;
  }
}
