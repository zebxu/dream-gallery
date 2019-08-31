import { Route, Switch } from 'react-router-dom';
import React from 'react';
import { Container, Divider } from 'semantic-ui-react';
import Footer from '../widgets/Footer';
import Navbar from '../widgets/Navbar';
import routes from '../configs/routes';

const Root = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Container>
        <Switch>
          {routes.map((props, index) => (
            <Route key={index} {...props} />
          ))}
        </Switch>
      </Container>
      <Divider />
      <Footer />
    </React.Fragment>
  );
};

export default Root;
