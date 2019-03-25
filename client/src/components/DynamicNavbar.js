import React, { Component } from 'react';
import { Menu, Input, Icon, Form } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default class MenuExampleInvertedSegment extends Component {
  state = { visible: false, searchInputVisible: false, search_input: '' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  showDynamicNavbar = () => {
    const scrollPos = document.scrollingElement.scrollTop;
    this.setState({ scrollPos: scrollPos });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.showDynamicNavbar);
  }

  componentWillUnmount() {
    console.log('DynamicNavbar -> componentWillUnmount()');
    window.removeEventListener('scroll', this.showDynamicNavbar);
  }

  render() {
    const { activeItem, scrollPos } = this.state;

    return (
      <Menu
        inverted
        color="teal"
        fixed="top"
        style={{
          transform: `translateY(${
            scrollPos > 150 ? Math.min(-50 + (scrollPos - 150), 0) : -100
          }px)`
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

        <Menu.Item
          as={NavLink}
          to="/all"
          name="all"
          active={activeItem === 'all'}
          onClick={this.handleItemClick}
        >
          All
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
            <Icon name="heart" />
          </Menu.Item>

          <Menu.Item style={{ padding: '.5rem' }}>
            <Form onSubmit={this.props.toSearchPage} size="mini">
              <Input
                size="mini"
                style={{ padding: '0' }}
                icon="search"
                placeholder="Search..."
                onChange={this.props.onChange}
              />
            </Form>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
