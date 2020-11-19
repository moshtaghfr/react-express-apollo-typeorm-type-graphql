import React from 'react';

type BookDetailsProps = {
  id: string;
};

const BookDetails = ({ id }: BookDetailsProps): JSX.Element => (
  <span>{id}</span>
);

export default BookDetails;
