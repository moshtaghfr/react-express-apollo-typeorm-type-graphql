import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

import { setSessionIdCookie } from './express-server';
import { getUserFromSessionId } from './models/Wilder';
import PictureResolver from './resolvers/PictureResolver';
import WilderResolver from './resolvers/WilderResolver';

export const getApolloServer = async (): Promise<{
  apolloServer: ApolloServer;
  graphQLSchema: GraphQLSchema;
}> => {
  const schema = await buildSchema({
    resolvers: [WilderResolver, PictureResolver],
  });
  const context = async ({ req, res }: { req: Request; res: Response }) => {
    const { sessionId } = req.cookies;
    const user = await getUserFromSessionId(sessionId);

    return {
      setSessionIdCookie: setSessionIdCookie(res),
      user,
    };
  };
  return {
    apolloServer: new ApolloServer({ schema, context }),
    graphQLSchema: schema,
  };
};
