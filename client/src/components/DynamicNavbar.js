import React, { Component } from 'react';
import { Menu, Input, Icon, Form, Transition } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default class MenuExampleInvertedSegment extends Component {
  state = { visible: false, searchInputVisible: false, search_input: '' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu
        inverted
        fixed="top"
        style={{
          visibility: this.props.visible ? 'visible' : 'hidden',
          transition: '.2s ease-in-out'
        }}
      >
        <Menu.Item header>
          <NavLink to="/">MY Avgle</NavLink>
        </Menu.Item>

        <Menu.Item
          as={NavLink}
          to="/vr"
          name="vr"
          active={activeItem === 'vr'}
          onClick={this.handleItemClick}
        >
          VR
        </Menu.Item>

        <Menu.Item
          as={NavLink}
          to="/ch"
          name="ch"
          active={activeItem === 'ch'}
          onClick={this.handleItemClick}
        >
          中文字幕
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            as={NavLink}
            to="/favorite"
            name="fav"
            active={activeItem === 'fav'}
            onClick={this.handleItemClick}
            position="right"
          >
            <Icon name="heart" color="teal" />
          </Menu.Item>

          <Menu.Item style={{ padding: '.5rem' }}>
            <Form onSubmit={this.toSearchPage} size="mini">
              <Input
                size="mini"
                style={{ padding: '0' }}
                icon="search"
                placeholder="Search..."
                onChange={this.onChange}
              />
            </Form>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
