import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import WilderResolver from './resolvers/WilderResolver';

export const getApolloServer = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [WilderResolver],
  });
  return new ApolloServer({ schema });
};
