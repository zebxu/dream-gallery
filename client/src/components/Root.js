import Landing from './Landing';
import Movie from './Movie';
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import Favorite from './Favorite';
import NotFound from './NotFound';

const Root = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Landing {...props} mode="CH" />}
        />
        <Route path="/ch" render={props => <Landing {...props} mode="CH" />} />
        <Route path="/favorite" component={Favorite} />
        <Route
          path="/search/:search_query"
          render={props => <Landing {...props} mode="SEARCH" />}
        />
        <Route path="/vr" render={props => <Landing {...props} mode="VR" />} />
        <Route
          path="/all"
          render={props => <Landing {...props} mode="ALL" />}
        />
        <Route path="/movie/:vid" exact component={Movie} />
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  );
};

export default Root;
