import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import BookDetails from './components/BookDetails';
import BookList from './components/BookList';

const App = (): JSX.Element => (
  <div className="App">
    <header>
      <h1>Bookstore</h1>
    </header>
    <Switch>
      <Route
        path="/books/:id"
        render={({
          match: {
            params: { id },
          },
        }) => <BookDetails id={id} />}
      />
      <Route exact path="/">
        <BookList />
      </Route>
    </Switch>
  </div>
);

export default App;
