import createTestClient from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { getExpressServer } from '../express-server';
import UserSession from '../models/UserSession';
import Wilder from '../models/Wilder';

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

  describe('mutation createSession', () => {
    describe('when username does not match existing wilder', () => {
      it('returns error', async () => {
        const response = await testClient.post('/graphql').send({
          query: `mutation {
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
        expect(response.text).toMatch('Incorrect username and/or password.');
      });
    });

    describe('when username matches existing wilder', () => {
      let wilder;
      beforeEach(async () => {
        wilder = Wilder.create({
          username: 'laurepincon',
          password: 'laurepassword',
          firstName: 'Laure',
          lastName: 'Pinçon',
        });
        await wilder.save();
      });

      describe('when password does not match wilder password', () => {
        it('returns error', async () => {
          const response = await testClient.post('/graphql').send({
            query: `mutation {
              createSession(input: {
                username: "laurepincon",
                password: "lauremotdepasse"
              }) {
                id
                username
              }
            }
            `,
          });
          expect(response.text).toMatch('Incorrect username and/or password.');
        });
      });

      describe('when password matches wilder password', () => {
        it('creates user session and sets cookie with user session ID', async () => {
          const response = await testClient.post('/graphql').send({
            query: `mutation {
              createSession(input: {
                username: "laurepincon",
                password: "laurepassword"
              }) {
                id
                username
              }
            }
            `,
          });

          expect(JSON.parse(response.text).data.createSession).toEqual({
            id: '1',
            username: 'laurepincon',
          });

          const userSession = await UserSession.findOneOrFail({
            user: wilder.id,
          });
          expect(response.header['set-cookie'][0]).toEqual(
            `sessionId=${userSession.uuid}; Max-Age=2592000; HttpOnly; SameSite=Strict`
          );
        });
      });
    });
  });
});
