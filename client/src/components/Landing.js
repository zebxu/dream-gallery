import Navbar from './Navbar';
import React from 'react';
import Footer from './Footer';
import MovieList from './MovieList';
import { Container, Divider } from 'semantic-ui-react';

const Landing = ({ mode, match }) => {
  return (
    <>
      <Navbar />
      <Container textAlign="center">
        <MovieList mode={mode} search_query={match.params.search_query} />
      </Container>
      <Divider />
      <Footer />
    </>
  );
};

export default Landing;
