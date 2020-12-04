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

const GET_WILDERS_ERROR_MOCK = {
  request: {
    query: GET_WILDERS,
  },
  error: new Error('Server error.'),
};

describe('WilderList', () => {
  describe('while fetching wilders', () => {
    it('renders loading indicator', () => {
      render(
        <MockedProvider mocks={[GET_WILDERS_MOCK]} addTypename={false}>
          <App />
        </MockedProvider>
      );
      expect(screen.getByText('Chargement en cours…')).toBeInTheDocument();
    });
  });

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

    describe('if fetching failed', () => {
      it('renders error message', async () => {
        render(
          <MockedProvider mocks={[GET_WILDERS_ERROR_MOCK]} addTypename={false}>
            <App />
          </MockedProvider>
        );
        await waitFor(() =>
          expect(screen.getByText('Erreur de chargement.')).toBeInTheDocument()
        );
      });
    });
  });
});
