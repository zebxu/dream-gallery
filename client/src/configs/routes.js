import React from 'react';
import Favorite from '../pages/Favorite';
import NotFound from '../pages/NotFound';
import Landing from '../pages/MovieList';

const routes = [
  {
    path: "/",
    exact: true,
    render: props => <Landing {...props} mode="CH" />
  },
  {
    path: "/ch",
    render: props => <Landing {...props} mode="CH" />
  },
  {
    path: "/favorite",
    component: Favorite
  },
  {
    path: "/search/:search_query",
    render: props => <Landing {...props} mode="SEARCH" />
  },
  {
    path: "/vr",
    render: props => <Landing {...props} mode="VR" />
  },
  {
    path: "/all",
    render: props => <Landing {...props} mode="ALL" />
  },
  {
    component: NotFound
  }
]

export default routes;