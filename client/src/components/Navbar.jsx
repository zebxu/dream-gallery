import React, { Component } from 'react';
import DynamicNavbar from './DynamicNavbar';
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
  state = {
    visible: false,
    searchInputVisible: false,
    search_input: ''
  };

  handleItemClick = (e, { name }) => {
    console.log('handleItemClick()');
    this.setState({ activeItem: name });
    this.hideSidebar();
    window.scroll(0, 0);
  };
  showSidebar = () => this.setState({ visible: true });
  hideSidebar = () => this.setState({ visible: false });
  showSearch = () => this.setState({ searchInputVisible: true });
  hideSearch = () => this.setState({ searchInputVisible: false });
  handleRef = c => {
    this.inputRef = c;
  };

  focus = async () => {
    await this.showSearch();
    this.inputRef.focus();
  };

  toSearchPage = e => {
    console.log('Navbar => toSearchPage()');
    const { search_input } = this.state;
    if (search_input !== '') {
      this.props.history.push({
        pathname: `/search/${search_input}`
      });
      this.hideSearch();
      this.setState({ search_input: '' });
      document.activeElement.blur();
      window.scroll(0, 0);
    }
  };

  onChange = (e, { value }) => {
    this.setState({ search_input: value });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (nextProps !== this.props) {
      return false;
    }
  }

  render() {
    const {
      activeItem,
      visible,
      searchInputVisible,
      search_input
    } = this.state;

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
                中文字幕
              </Menu.Item>
            </Responsive>

            <Responsive minWidth={768}>
              <Menu.Item
                as={NavLink}
                to="/all"
                style={{ color: '#000', marginTop: '1rem' }}
                name="all"
                active={activeItem === 'all'}
                onClick={this.handleItemClick}
              >
                All
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
                    value={search_input}
                    className="searchInput"
                    icon="search"
                    ref={this.handleRef}
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
                  duration={50}
                >
                  <Form onSubmit={this.toSearchPage}>
                    <Input
                      value={search_input}
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
                  animation="fade"
                  duration={{ hide: 1, show: 1000 }}
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
            active={activeItem === 'saved'}
            onClick={this.handleItemClick}
          >
            <Icon name="remove bookmark" color="red" size="mini" />
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

          <Menu.Item
            as={NavLink}
            to="/all"
            name="all"
            active={activeItem === 'all'}
            onClick={this.handleItemClick}
          >
            All
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              this.focus();
              this.hideSidebar();
            }}
            icon="search"
          />

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
        <Responsive minWidth={768}>
          <DynamicNavbar
            toSearchPage={this.toSearchPage}
            onChange={this.onChange}
          />
        </Responsive>
      </div>
    );
  }
}

export default withRouter(Navbar);
