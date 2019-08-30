import React from 'react';
import Footer from '../common/Footer';
import MovieList from './MovieList';
import { Container, Divider } from 'semantic-ui-react';

const Landing = ({ mode, match }) => {
  return (
    <>
      <Container textAlign="center">
        <MovieList mode={mode} />
      </Container>
      <Divider />
      <Footer />
    </>
  );
};

export default Landing;
