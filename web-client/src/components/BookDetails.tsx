import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { GetBookDetails } from '../schemaTypes';

const GET_BOOK_DETAILS = gql`
  query GetBookDetails($id: String!) {
    book(id: $id) {
      id
      title
      author
      isPublished
    }
  }
`;

type BookDetailsProps = {
  id: string;
};

const BookDetails = ({ id }: BookDetailsProps): JSX.Element => {
  const { loading, error, data } = useQuery<GetBookDetails>(GET_BOOK_DETAILS, {
    variables: { id },
  });

  const book = data?.book;

  return (
    <>
      {loading
        ? 'Loading…'
        : error
        ? 'Error fetching book details.'
        : book && (
            <>
              <h1>{book.title}</h1>
              <h2>{book.author}</h2>
              {book.isPublished ? 'Published' : 'Not published'}
            </>
          )}
    </>
  );
};

export default BookDetails;
