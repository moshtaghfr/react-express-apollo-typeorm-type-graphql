import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PictureGallery from './components/PictureGallery';
import WilderList from './components/WilderList';
import { GetTodayNewWildersSummary } from './schemaTypes';

export const GET_TODAY_NEW_WILDERS_SUMMARY = gql`
  query GetTodayNewWildersSummary {
    todayNewWildersSummary
  }
`;

const App = (): JSX.Element => {
  const { loading, data } = useQuery<GetTodayNewWildersSummary>(
    GET_TODAY_NEW_WILDERS_SUMMARY
  );

  return (
    <>
      {loading ? '…' : data?.todayNewWildersSummary}
      <Switch>
        <Route exact path="/" component={WilderList} />
        <Route path="/pictures" component={PictureGallery} />
      </Switch>
    </>
  );
};

export default App;
