import createTestClient from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { getExpressServer } from './express-server';
import UserSession from './models/UserSession';
import Wilder from './models/Wilder';

describe('Server', () => {
  let testClient;

  beforeEach(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Wilder, UserSession],
      synchronize: true,
      logging: false,
    });
    const { expressServer } = await getExpressServer();
    testClient = createTestClient(expressServer);
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  describe('query wilders', () => {
    it('returns all wilders', async () => {
      const wilder1 = Wilder.create({
        username: 'laurepincon',
        password: 'laurepassword',
        firstName: 'Laure',
        lastName: 'Pinçon',
      });
      await wilder1.save();
      const wilder2 = Wilder.create({
        username: 'pierreroulle',
        password: 'pierrepassword',
        firstName: 'Pierre',
        lastName: 'Roulle',
      });
      await wilder2.save();

      const response = await testClient.post('/graphql').send({
        query: `{
        wilders {
          id
          firstName
          lastName
        }
      }
      `,
      });

      expect(JSON.parse(response.text).data).toEqual({
        wilders: [
          {
            firstName: 'Laure',
            id: '1',
            lastName: 'Pinçon',
          },
          {
            firstName: 'Pierre',
            id: '2',
            lastName: 'Roulle',
          },
        ],
      });
    });
  });

  describe('mutation createWilder', () => {
    it('creates and returns a new wilder', async () => {
      const response = await testClient.post('/graphql').send({
        query: `mutation {
        createWilder(
          input: {
            username: "arnaudrenaud"
            password: "bateaubateau"
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

      expect(await Wilder.count({})).toEqual(1);
      expect(JSON.parse(response.text).data).toEqual({
        createWilder: {
          id: '1',
          firstName: 'Arnaud',
          lastName: 'Renaud',
        },
      });
    });
  });
});
