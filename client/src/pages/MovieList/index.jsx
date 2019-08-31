import React from 'react';
import MovieList from './MovieList';

const Landing = ({ mode, match }) => {
  return (
    <>
      <MovieList mode={mode} />
    </>
  );
};

export default Landing;
