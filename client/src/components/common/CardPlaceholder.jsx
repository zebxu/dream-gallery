import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react';

const CardPlaceholder = () => (
  <Card centered fluid>
    <Placeholder fluid>
      <Placeholder.Image rectangular />
    </Placeholder>
    <Card.Content textAlign="left">
      <Card.Header>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Card.Header>
      <Card.Meta>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </Card.Meta>
      <Card.Description>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Card.Description>
    </Card.Content>
  </Card>
);

export default CardPlaceholder;
