import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import WilderList, { GET_WILDERS, SUBSCRIBE_TO_NEW_WILDER } from './WilderList';

const GET_WILDERS_SUCCESS_MOCK = {
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

const GET_WILDERS_ERROR_MOCK = {
  request: {
    query: GET_WILDERS,
  },
  error: new Error('Server error.'),
};

const SUBSCRIBE_TO_NEW_WILDER_MOCK_NO_DATA_RECEIVED = {
  request: {
    query: SUBSCRIBE_TO_NEW_WILDER,
  },
  result: {},
};

const SUBSCRIBE_TO_NEW_WILDER_MOCK_DATA_RECEIVED = {
  request: {
    query: SUBSCRIBE_TO_NEW_WILDER,
  },
  result: {
    data: {
      newWilder: { id: '3', displayName: '[?] Antoine Dé' },
    },
  },
};

const renderWilderList = (mocks: MockedResponse<Record<string, unknown>>[]) => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <WilderList />
    </MockedProvider>
  );
};

describe('WilderList', () => {
  describe('while fetching wilders', () => {
    it('renders loading indicator', () => {
      renderWilderList([
        GET_WILDERS_SUCCESS_MOCK,
        SUBSCRIBE_TO_NEW_WILDER_MOCK_NO_DATA_RECEIVED,
      ]);
      expect(screen.getByText('Chargement en cours…')).toBeInTheDocument();
    });
  });

  describe('after fetching', () => {
    describe('if fetching succeeded', () => {
      describe('if no new wilder received', () => {
        it('renders wilders list', async () => {
          renderWilderList([
            GET_WILDERS_SUCCESS_MOCK,
            SUBSCRIBE_TO_NEW_WILDER_MOCK_NO_DATA_RECEIVED,
          ]);
          const list = await waitFor(() => screen.getByRole('list'));
          const listElements = within(list).getAllByRole('listitem');

          expect(listElements).toHaveLength(2);
          expect(listElements[0]).toHaveTextContent('[?] Luc Bah');
          expect(listElements[1]).toHaveTextContent('[Lyon] Sophie Cé');
        });
      });

      describe('if new wilder received', () => {
        it('renders wilders list with new wilder', async () => {
          renderWilderList([
            GET_WILDERS_SUCCESS_MOCK,
            SUBSCRIBE_TO_NEW_WILDER_MOCK_DATA_RECEIVED,
          ]);
          const list = await waitFor(() => screen.getByRole('list'));
          const listElements = within(list).getAllByRole('listitem');

          expect(listElements).toHaveLength(3);
          expect(listElements[0]).toHaveTextContent('[?] Luc Bah');
          expect(listElements[1]).toHaveTextContent('[Lyon] Sophie Cé');
          expect(listElements[2]).toHaveTextContent('[?] Antoine Dé');
        });
      });
    });

    describe('if fetching failed', () => {
      it('renders error message', async () => {
        renderWilderList([
          GET_WILDERS_ERROR_MOCK,
          SUBSCRIBE_TO_NEW_WILDER_MOCK_NO_DATA_RECEIVED,
        ]);
        await waitFor(() =>
          expect(screen.getByText('Erreur de chargement.')).toBeInTheDocument()
        );
      });
    });
  });
});
