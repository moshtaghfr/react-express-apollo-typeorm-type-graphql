import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';

import { GetWilders, SubscribeToNewWilder } from '../schemaTypes';
import ScrollToTopButton from './ScrollToTopButton';
import CreateWilderForm from './CreateWilderForm';

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

export const SUBSCRIBE_TO_NEW_WILDER = gql`
  subscription SubscribeToNewWilder {
    newWilder {
      id
      displayName
    }
  }
`;

const useGetWildersAndSubscribeToMore = () => {
  const { loading, error, data, subscribeToMore } = useQuery<GetWilders>(
    GET_WILDERS
  );

  const [isSubscribedToNewWilder, setIsSubscribedToNewWilder] = useState(false);
  useEffect(() => {
    if (!isSubscribedToNewWilder) {
      subscribeToMore<SubscribeToNewWilder>({
        document: SUBSCRIBE_TO_NEW_WILDER,
        updateQuery: (prev, { subscriptionData }): GetWilders => {
          if (!subscriptionData.data) return prev;
          return {
            wilders: [...prev.wilders, subscriptionData.data.newWilder],
          };
        },
      });
      setIsSubscribedToNewWilder(true);
    }
  }, [data]);

  return { loading, error, data };
};

const PictureGallery = (): JSX.Element => {
  const { loading, error, data } = useGetWildersAndSubscribeToMore();

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

export default PictureGallery;
