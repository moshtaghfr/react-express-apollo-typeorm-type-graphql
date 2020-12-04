import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import App, { GET_WILDERS } from './App';

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

const renderApp = (mocks: MockedResponse<Record<string, unknown>>[]) => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );
};

describe('WilderList', () => {
  describe('while fetching wilders', () => {
    it('renders loading indicator', () => {
      renderApp([GET_WILDERS_SUCCESS_MOCK]);
      expect(screen.getByText('Chargement en cours…')).toBeInTheDocument();
    });
  });

  describe('after fetching', () => {
    describe('if fetching succeeded', () => {
      it('renders wilders list', async () => {
        renderApp([GET_WILDERS_SUCCESS_MOCK]);
        const list = await waitFor(() => screen.getByRole('list'));
        const listElements = within(list).getAllByRole('listitem');

        expect(listElements).toHaveLength(2);
        expect(listElements[0]).toHaveTextContent('[?] Luc Bah');
        expect(listElements[1]).toHaveTextContent('[Lyon] Sophie Cé');
      });
    });

    describe('if fetching failed', () => {
      it('renders error message', async () => {
        renderApp([GET_WILDERS_ERROR_MOCK]);
        await waitFor(() =>
          expect(screen.getByText('Erreur de chargement.')).toBeInTheDocument()
        );
      });
    });
  });
});
