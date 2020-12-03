import { createTestClient } from 'apollo-server-testing';
import { createConnection, getConnection } from 'typeorm';

import { getApolloServer } from './apollo-server';
import Wilder from './models/Wilder';

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

  describe('mutation createWilder', () => {
    it('creates and returns a new wilder', async () => {
      const response = await mutate({
        mutation: `mutation {
        createWilder(
          input: {
            firstName: "Arnaud"
            lastName: "Renaud"
          }
        ) {
          id
          firstName
          lastName
        }
      }
      `,
      });
      expect(response.data).toEqual({
        createWilder: {
          id: '1',
          firstName: 'Arnaud',
          lastName: 'Renaud',
        },
      });
    });
  });
});
