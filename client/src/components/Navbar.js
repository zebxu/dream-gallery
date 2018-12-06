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

class Navbar extends Component {
  state = { visible: false, searchInputVisible: false, search_input: '' };

  handleItemClick = (e, { name }) => {
    console.log('handleItemClick()');
    this.setState({ activeItem: name });
  };
  showSidebar = () => this.setState({ visible: true });
  hideSidebar = () => this.setState({ visible: false });
  showSearch = () => this.setState({ searchInputVisible: true });
  handleRef = c => {
    this.inputRef = c;
  };

  focus = async () => {
    await this.showSearch();
    this.inputRef.focus();
  };

  toSearchPage = e => {
    const { search_input } = this.state;
    this.props.history.push({
      pathname: `/search/${search_input}`
    });
  };

  onChange = (e, { value }) => {
    this.setState({ search_input: value });
  };

  render() {
    const { activeItem, visible, searchInputVisible } = this.state;

    return (
      <div>
        <Segment>
          <Menu secondary>
            <Menu.Item header>
              <NavLink to="/" style={{ color: '#2BBBAD' }}>
                MY Avgle
              </NavLink>
            </Menu.Item>

            <Responsive minWidth={768}>
              <Menu.Item
                as={NavLink}
                to="/vr"
                style={{ color: '#000', marginTop: '1rem' }}
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
                style={{ color: '#000', marginTop: '1rem' }}
                name="ch"
                active={activeItem === 'ch'}
                onClick={this.handleItemClick}
              >
                中文
              </Menu.Item>
            </Responsive>

            <Menu.Menu position="right">
              <Responsive minWidth={768}>
                <Menu.Item
                  as={NavLink}
                  to="/favorite"
                  style={{ color: '#000', marginTop: '1rem' }}
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
                <Form onSubmit={this.toSearchPage}>
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={this.onChange}
                  />
                </Form>
              </Responsive>

              <Menu.Item>
                <Responsive
                  {...Responsive.onlyMobile}
                  as={Transition}
                  visible={searchInputVisible}
                  animation="scale"
                  duration={500}
                >
                  <Form onSubmit={this.toSearchPage}>
                    <Input
                      placeholder="Search..."
                      size="mini"
                      transparent
                      icon="like"
                      iconPosition="left"
                      ref={this.handleRef}
                      onChange={this.onChange}
                    />
                  </Form>
                </Responsive>
              </Menu.Item>
              <Menu.Item>
                <Responsive
                  {...Responsive.onlyMobile}
                  as={Transition}
                  visible={!searchInputVisible}
                  animation="scale"
                  duration={1000}
                >
                  <Button icon="search" onClick={this.focus} />
                </Responsive>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>

        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.hideSidebar}
          vertical
          visible={visible}
          width="thin"
          direction="bottom"
        >
          <Menu.Item
            as={NavLink}
            to="/favorite"
            name="saved"
            active={activeItem === 'ch'}
            onClick={this.handleItemClick}
          >
            <Icon name="remove bookmark" color="red" />
            Saved
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
            中文
          </Menu.Item>

          <Menu.Item onClick={this.hideSidebar}>&#10005;</Menu.Item>
        </Sidebar>

        <Responsive
          {...Responsive.onlyMobile}
          as={Button}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: '1'
          }}
          icon="bars"
          color="black"
          onClick={this.showSidebar}
        />
      </div>
    );
  }
}

export default withRouter(Navbar);
