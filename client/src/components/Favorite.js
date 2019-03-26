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
  // constructor(props) {
  //   super(props);
  //   this.getData = this.getData.bind(this);
  //   this.state = {
  //     videos: null
  //   };
  // }
  state = {
    videos: null,
    filter: 'all',
    fetchingData: true,
    isRemoving: false,
    removingKey: -1
  };

  getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('filter')) {
      this.setState({ filter: params.get('filter') });
    }
    this.setState({ page: params.get('p') ? parseInt(params.get('p')) : 1 });
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getUrlParams();
      this.getData(true);
      window.scrollTo(0, 0);
    }
  }

  componentDidMount() {
    this.getUrlParams();
    this.getData(true);
  }

  removeMovie = saved_id => {
    this.setState({ isRemoving: true, removingKey: saved_id });
    const ref = firebase.database().ref('movies/' + saved_id);
    ref
      .remove()
      .then(() => {
        console.log('Remove succeeded.');
        this.getData(false);
      })
      .catch(function(error) {
        console.log('Remove failed: ' + error.message);
      });
    // axios.delete(`/api/movies/${saved_id}`).then(
    //   res => {
    //     console.log(res);
    //     if (res.status === 200) {
    //       console.log('delete movie successed' + saved_id);
    //       this.getData(false);
    //     } else {
    //       console.log('delete movie failed');
    //     }
    //   },
    //   err => console.log(err)
    // );
  };

  getData = refresh => {
    if (refresh) {
      this.setState({ fetchingData: true });
    }
    console.log('Favorite -> getData() ');
    const ref = firebase.database().ref('movies');
    ref.on('value', snap => {
      console.log(snap.val());
      console.log(snap.numChildren());
      this.setState({
        videos: snap.val(),
        total_videos: snap.numChildren()
      });
      this.setState({ isRemoving: false, fetchingData: false });
    });
  };

  changePage = (event, data) => {
    const { filter } = this.state;
    this.setState({ page: data.activePage });
    this.props.history.push({
      search: `?filter=${filter}&p=${data.activePage}`
    });
    this.getData(true);
    window.scrollTo(0, 0);
  };

  render() {
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
