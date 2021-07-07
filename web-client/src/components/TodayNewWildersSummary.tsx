import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_TODAY_NEW_WILDERS_SUMMARY } from '../App';
import { GetTodayNewWildersSummary } from '../schemaTypes';

const TodayNewWildersSummary = (): JSX.Element => {
  const { loading: summaryLoading, data: summaryData } = useQuery<
    GetTodayNewWildersSummary
  >(GET_TODAY_NEW_WILDERS_SUMMARY);

  return (
    <div>{summaryLoading ? '…' : summaryData?.todayNewWildersSummary}</div>
  );
};

export default TodayNewWildersSummary;
