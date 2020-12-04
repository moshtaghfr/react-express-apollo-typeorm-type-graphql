import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import App, { GET_WILDERS } from './App';

const GET_WILDERS_MOCK = {
  request: {
    query: GET_WILDERS,
  },
  result: {
    data: {
      wilders: [
        { id: '1', displayName: '[?] Luc Bah' },
        { id: '2', displayName: '[Lyon] Sophie Cé' },
      ],
    },
  },
};

describe('WilderList', () => {
  describe('after fetching', () => {
    describe('if fetching succeeded', () => {
      it('renders wilders list', async () => {
        render(
          <MockedProvider mocks={[GET_WILDERS_MOCK]} addTypename={false}>
            <App />
          </MockedProvider>
        );
        const list = await waitFor(() => screen.getByRole('list'));
        const listElements = within(list).getAllByRole('listitem');

        expect(listElements).toHaveLength(2);
        expect(listElements[0]).toHaveTextContent('[?] Luc Bah');
        expect(listElements[1]).toHaveTextContent('[Lyon] Sophie Cé');
      });
    });
  });
});
