import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { GetBooks } from '../schemaTypes';
import { Link } from 'react-router-dom';

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
    }
  }
`;

const BookList = (): JSX.Element => {
  const { loading, error, data } = useQuery<GetBooks>(GET_BOOKS);

  return (
    <>
      {loading
        ? 'Loading…'
        : error
        ? 'Error fetching books.'
        : data && (
            <ul>
              {data.books.map((book) => (
                <li key={book.id}>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </li>
              ))}
            </ul>
          )}
    </>
  );
};

export default BookList;
