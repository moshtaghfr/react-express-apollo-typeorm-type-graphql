import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { GET_TODAY_NEW_WILDERS_SUMMARY_MOCK } from './apollo-mocks';
import TodayNewWildersSummary from './TodayNewWildersSummary';

const renderWilderList = (mocks: MockedResponse<Record<string, unknown>>[]) => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TodayNewWildersSummary />
    </MockedProvider>
  );
};

describe('TodayNewWildersSummary', () => {
  describe('rendering today new wilders summary', () => {
    describe('if fetching succeeded', () => {
      it('renders today new wilders summary', async () => {
        renderWilderList([GET_TODAY_NEW_WILDERS_SUMMARY_MOCK]);
        await waitFor(() =>
          expect(
            screen.getByText('Arnaud subscribed today.')
          ).toBeInTheDocument()
        );
      });
    });
  });
});
