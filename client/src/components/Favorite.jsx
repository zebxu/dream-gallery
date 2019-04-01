import React, { Component } from 'react';
import {
  Item,
  Container,
  Grid,
  Segment,
  Dropdown,
  Loader
} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import FavMovie from './FavMovie';
import Navbar from './Navbar';
import MainPagination from './MainPagination';
import * as firebase from 'firebase';

export default class Favorite extends Component {
  state = {
    videos: null,
    filter: 'all',
    fetchingData: true,
    isRemoving: false,
    removingKey: -1
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({ fetchingData: true });
      this.fetchData();
      window.scrollTo(0, 0);
    }
  }

  componentDidMount() {
    this.fetchData();
  }
  // call fetch function and set state using result
  fetchData = async () => {
    const params = new URLSearchParams(window.location.search);
    const data = await this.getData();
    this.setState({
      videos: data.val,
      total_videos: data.count,
      isRemoving: false,
      fetchingData: false,
      filter: params.get('filter') ? params.get('filter') : 'all',
      page: params.get('p') ? parseInt(params.get('p')) : 1
    });
  };

  removeMovie = async saved_id => {
    this.setState({ isRemoving: true, removingKey: saved_id });
    await firebase
      .database()
      .ref('movies/' + saved_id)
      .remove();
    console.log('Remove succeeded.');
    this.fetchData();
  };

  getData = async () => {
    console.log('Favorite -> getData() ');
    let data = {};
    await firebase
      .database()
      .ref('movies')
      .once('value', snap => {
        // console.log(snap.val());
        // console.log(snap.numChildren());
        data = { val: snap.val(), count: snap.numChildren() };
      });
    return data;
  };

  changePage = (event, data) => {
    const { filter } = this.state;
    this.props.history.push({
      search: `?filter=${filter}&p=${data.activePage}`
    });
    window.scrollTo(0, 0);
  };

  render() {
    console.log('render()');
    const {
      videos,
      total_videos,
      page,
      filter,
      fetchingData,
      removingKey,
      isRemoving
    } = this.state;
    return (
      <>
        <Navbar />
        <Container>
          <Grid>
            <Grid.Column textAlign="center">
              {fetchingData ? null : (
                <MainPagination
                  activePage={page}
                  totalPages={total_videos ? Math.ceil(total_videos / 10) : 10}
                  changePage={this.changePage}
                />
              )}
            </Grid.Column>
          </Grid>
          <Dropdown
            text={
              filter === 'all' ? 'All' : filter === 'VR' ? 'VR' : '中文字幕'
            }
            floating
            labeled
            className="icon"
            style={{ marginRight: '2rem' }}
          >
            <Dropdown.Menu>
              <Dropdown.Header icon="filter" content="Filter" />
              <Dropdown.Item
                active={filter === 'all'}
                as={NavLink}
                to={{ search: `?filter=all&p=${page}` }}
                name="filter"
                value="vr"
              >
                All
              </Dropdown.Item>
              <Dropdown.Item
                active={filter === 'VR'}
                as={NavLink}
                to={{ search: `?filter=VR&p=${page}` }}
                name="filter"
                value="vr"
              >
                VR
              </Dropdown.Item>
              <Dropdown.Item
                active={filter === 'CH'}
                as={NavLink}
                to={{ search: `?filter=CH&p=${page}` }}
                name="filter"
                value="ch"
              >
                中文字幕
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Segment raised>
            <Item.Group relaxed divided>
              {fetchingData ? (
                <>
                  <br />
                  <Loader active />
                  <br />
                </>
              ) : (
                Object.keys(videos)
                  .reverse()
                  .map((key, index) => {
                    if (Math.floor(index / 10) === page - 1) {
                      return (
                        <FavMovie
                          video={videos[key]}
                          key={key}
                          remove_id={key}
                          removing={
                            videos[key].vid === removingKey && isRemoving
                          }
                          removeFunc={this.removeMovie}
                        />
                      );
                    }
                    return null;
                  })
              )}
            </Item.Group>
          </Segment>
          <Grid>
            <Grid.Column textAlign="center">
              {total_videos ? (
                <MainPagination
                  activePage={page}
                  totalPages={total_videos ? Math.ceil(total_videos / 10) : 10}
                  changePage={this.changePage}
                />
              ) : null}
            </Grid.Column>
          </Grid>
        </Container>
      </>
    );
  }
}
