import { createTestClient } from 'apollo-server-testing';
import { createConnection, getConnection } from 'typeorm';

import { getApolloServer } from '../apollo-server';
import Wilder from '../models/Wilder';

describe('Server', () => {
  let query;
  let mutate;

  beforeEach(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Wilder],
      synchronize: true,
      logging: false,
    });
    const server = await getApolloServer();
    const testClient = createTestClient(server);
    mutate = testClient.mutate;
    query = testClient.query;
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  describe('mutation createSession', () => {
    describe('when username does not match existing wilder', () => {
      it('returns error', async () => {
        const response = await mutate({
          mutation: `mutation {
            createSession(input: {
              username: "vmarchand",
              password: "bateau8888"
            }) {
              id
              username
            }
          }
        `,
        });
        expect(response.error).toEqual({});
      });
    });

    describe('when username matches existing wilder', () => {
      describe('when password does not match wilder password', () => {
        it('returns error', () => {});
      });

      describe('when password matches wilder password', () => {
        it('creates user session', () => {});

        it('sets cookie with user session ID', () => {});
      });
    });
  });
});
