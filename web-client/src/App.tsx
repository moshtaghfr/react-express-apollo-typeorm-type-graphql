import React from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';
import { GetBooks } from './schemaTypes';

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
    }
  }
`;

const App = (): JSX.Element => {
  const { loading, error, data } = useQuery<GetBooks>(GET_BOOKS);

  return (
    <div className="App">
      {loading
        ? 'Loading…'
        : error
        ? 'Error fetching books.'
        : data && (
            <ul>
              {data.books.map((book) => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
          )}
    </div>
  );
};

export default App;
