import React, { Component } from 'react';
import {
  Menu,
  Responsive,
  Button,
  Input,
  Segment,
  Sidebar,
  Transition,
  Icon,
  Form
} from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';

export default class MenuExampleInvertedSegment extends Component {
  state = { visible: false, searchInputVisible: false, search_input: '' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, visible, searchInputVisible } = this.state;

    return (
      <Menu inverted>
        <Menu.Item header>
          <NavLink to="/">MY Avgle</NavLink>
        </Menu.Item>

        <Responsive minWidth={768}>
          <Menu.Item
            as={NavLink}
            to="/vr"
            name="vr"
            active={activeItem === 'vr'}
            onClick={this.handleItemClick}
          >
            VR
          </Menu.Item>
        </Responsive>

        <Responsive minWidth={768}>
          <Menu.Item
            as={NavLink}
            to="/ch"
            name="ch"
            active={activeItem === 'ch'}
            onClick={this.handleItemClick}
          >
            中文字幕
          </Menu.Item>
        </Responsive>

        <Menu.Menu position="right">
          <Responsive minWidth={768}>
            <Menu.Item
              as={NavLink}
              to="/favorite"
              name="fav"
              active={activeItem === 'fav'}
              onClick={this.handleItemClick}
              position="right"
            >
              <Icon name="heart" color="teal" />
              收藏
            </Menu.Item>
          </Responsive>
          <Responsive minWidth={768} as={Menu.Item}>
            <Form onSubmit={this.toSearchPage} size="mini">
              <Input
                icon="search"
                placeholder="Search..."
                onChange={this.onChange}
              />
            </Form>
          </Responsive>
        </Menu.Menu>
      </Menu>
    );
  }
}
