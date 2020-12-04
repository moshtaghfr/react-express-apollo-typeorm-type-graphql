import { gql, useQuery } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import CreateWilderForm from './components/CreateWilderForm';
import ScrollToTopButton from './components/ScrollToTopButton';

import { GetWilders } from './schemaTypes';

const StyledWilderList = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;
  display: grid;
  gap: 18px;
`;

const StyledWilderListItem = styled.li`
  background-color: white;
  padding: 36px 18px;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
`;

const StyledWilderListItemName = styled.span`
  font-size: 20px;
`;

export const GET_WILDERS = gql`
  query GetWilders {
    wilders {
      id
      displayName
    }
  }
`;

const App = (): JSX.Element => {
  const { loading, error, data } = useQuery<GetWilders>(GET_WILDERS);

  return (
    <>
      <h1>Wilders</h1>
      <CreateWilderForm />
      {loading ? (
        <div>Chargement en cours…</div>
      ) : error ? (
        <div>Erreur de chargement.</div>
      ) : (
        data && (
          <StyledWilderList>
            {data.wilders.map((wilder) => (
              <StyledWilderListItem key={wilder.id}>
                <StyledWilderListItemName>
                  {wilder.displayName}
                </StyledWilderListItemName>
              </StyledWilderListItem>
            ))}
          </StyledWilderList>
        )
      )}
      <ScrollToTopButton />
    </>
  );
};

export default App;
