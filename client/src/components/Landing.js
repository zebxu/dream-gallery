import Navbar from './Navbar';
import React from 'react';
import Footer from './Footer';
import MovieList from './MovieList';
import { Container, Divider } from 'semantic-ui-react';
import DynamicNavbar from './DynamicNavbar';

const Landing = ({ mode, match }) => {
  return (
    <>
      <Navbar />
      <Container textAlign="center">
        <MovieList mode={mode} />
      </Container>
      <Divider />
      <Footer />
    </>
  );
};

export default Landing;
