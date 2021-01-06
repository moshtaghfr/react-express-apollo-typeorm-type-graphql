import createTestClient from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { getExpressServer } from '../express-server';
import UserSession from '../models/UserSession';
import Wilder from '../models/Wilder';

describe('Wilder resolvers', () => {
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

  describe('query me', () => {
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

    describe('when user is not authenticated', () => {
      it('returns error', async () => {
        const response = await testClient.post('/graphql').send({
          query: `{
          me {
            firstName
          }
        }
        `,
        });

        expect(response.text).toMatch('You are not authenticated.');
      });
    });

    describe('when user is authenticated', () => {
      it('returns user', async () => {
        const wilderSession = UserSession.create({ user: wilder });
        await wilderSession.save();

        const response = await testClient
          .post('/graphql')
          .set('Cookie', [`sessionId=${wilderSession.uuid}`])
          .send({
            query: `{
              me {
                firstName
              }
            }
          `,
          });

        expect(JSON.parse(response.text).data).toEqual({
          me: {
            firstName: wilder.firstName,
          },
        });
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
          const cookie = response.header['set-cookie'][0];
          expect(cookie).toMatch(`sessionId=${userSession.uuid}`);
          expect(cookie).toMatch(`Path=/`);
          expect(cookie).toMatch(`Max-Age=2592000`);
          expect(cookie).toMatch(`HttpOnly`);
          expect(cookie).toMatch(`SameSite=Strict`);
        });
      });
    });
  });
});
