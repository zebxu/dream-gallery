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
import axios from 'axios';
import Navbar from './Navbar';
import MainPagination from './MainPagination';

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

  async componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      await this.getUrlParams();
      await this.getData(true);
      await window.scrollTo(0, 0);
    }
  }

  async componentDidMount() {
    await this.getUrlParams();
    this.getData(true);
  }

  removeMovie = saved_id => {
    this.setState({ isRemoving: true, removingKey: saved_id });
    axios.delete(`/api/movies/${saved_id}`).then(
      res => {
        console.log(res);
        if (res.status === 200) {
          console.log('delete movie successed' + saved_id);
          this.getData(false);
        } else {
          console.log('delete movie failed');
        }
      },
      err => console.log(err)
    );
  };

  getData = refresh => {
    const { filter } = this.state;
    if (refresh) {
      this.setState({ fetchingData: true });
    }
    console.log('Favorite -> getData() ');
    axios
      .get(`/api/movies/${filter === 'all' ? '' : filter}`)
      .then(async res => {
        if (res.status === 200) {
          console.log(
            'api url',
            `http://localhost:5000/api/movies/${filter ? filter : ''}`
          );
          console.log(res.data);
          await this.setState({
            videos: res.data.videos,
            total_videos: res.data.count
          });
          this.setState({ isRemoving: false });
        } else {
          console.error('Can not fetch data');
        }
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        this.setState({ fetchingData: false });
      });
  };

  changePage = async (event, data) => {
    const { filter } = this.state;
    await this.setState({ page: data.activePage });
    await this.props.history.push({
      search: `?filter=${filter}&p=${data.activePage}`
    });
    await this.getData(true);
    await window.scrollTo(0, 0);
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
            <Item.Group>
              {fetchingData ? (
                <>
                  <br />
                  <Loader active />
                  <br />
                </>
              ) : (
                videos.map((value, key) => {
                  if (Math.floor(key / 10) === page - 1) {
                    return (
                      <FavMovie
                        video={value}
                        key={key}
                        removing={value._id === removingKey && isRemoving}
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
