import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PictureGallery from './components/PictureGallery';
import WilderList from './components/WilderList';

const App = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/" component={WilderList} />
      <Route path="/pictures" component={PictureGallery} />
    </Switch>
  );
};

export default App;
