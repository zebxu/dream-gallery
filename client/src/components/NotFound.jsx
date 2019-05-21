import React from 'react';
import Navbar from './common/Navbar';
import { Container } from 'semantic-ui-react';

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <Container>
        <h1>Page not Found</h1>
      </Container>
    </div>
  );
}
