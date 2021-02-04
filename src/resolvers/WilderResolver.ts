import { compare } from 'bcrypt';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Subscription,
  Root,
  PubSub,
  Publisher,
} from 'type-graphql';

import CreateSessionInput from '../inputs/CreateSessionInput';
import CreateWilderInput from '../inputs/CreateWilderInput';
import UserSession from '../models/UserSession';
import Wilder from '../models/Wilder';

type NewWilderNotificationPayload = {
  wilder: Wilder;
};

@Resolver()
export default class WilderResolver {
  @Query(() => [Wilder])
  wilders(): Promise<Wilder[]> {
    return Wilder.find();
  }

  @Subscription({
    topics: 'NEW_WILDER',
  })
  newWilder(@Root() notificationPayload: NewWilderNotificationPayload): Wilder {
    return notificationPayload.wilder;
  }

  @Query(() => Wilder)
  me(@Ctx() { user }: { user: Wilder | null }): Wilder {
    if (!user) {
      throw Error('You are not authenticated.');
    }
    return user;
  }

  @Mutation(() => Wilder)
  async createWilder(
    @Arg('input') input: CreateWilderInput,
    @PubSub('NEW_WILDER')
    publishNewWilder: Publisher<NewWilderNotificationPayload>
  ): Promise<Wilder> {
    const wilder = Wilder.create(input);
    await wilder.save();
    publishNewWilder({ wilder });
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
