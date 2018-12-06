import React, { Component } from 'react';
import { Item, Container, Grid, Segment, Dropdown } from 'semantic-ui-react';
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
  state = { videos: null, filter: 'all' };

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
      this.getData();
    }
  }

  async componentDidMount() {
    await this.getUrlParams();
    this.getData();
  }
  removeMovie = saved_id => {
    axios.delete(`/api/movies/${saved_id}`).then(
      res => {
        console.log(res);
        if (res.status === 200) {
          console.log('delete movie successed' + saved_id);
          this.getData();
        } else {
          console.log('delete movie failed');
        }
      },
      err => console.log(err)
    );
  };

  getData() {
    const { filter } = this.state;
    console.log('Favorite -> getData() ');
    axios
      .get(`/api/movies/${filter === 'all' ? '' : filter}`)
      .then(res => {
        if (res.status === 200) {
          console.log(
            'api url',
            `http://localhost:5000/api/movies/${filter ? filter : ''}`
          );
          console.log(res.data);
          this.setState({
            videos: res.data.videos,
            total_videos: res.data.count
          });
        } else {
          console.error('Can not fetch data');
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  changePage = async (event, data) => {
    const { filter } = this.state;
    await this.setState({ page: data.activePage });
    await this.props.history.push({
      search: `?filter=${filter}&p=${data.activePage}`
    });
    await this.getData();
    await window.scrollTo(0, 0);
  };

  render() {
    const { videos, total_videos, page, filter } = this.state;
    return (
      <>
        <Navbar />
        <Container>
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
          <Dropdown
            text={filter === null ? 'All' : filter === 'VR' ? 'VR' : '中文字幕'}
            floating
            labeled
            className="icon"
            style={{ marginRight: '2rem' }}
          >
            <Dropdown.Menu>
              <Dropdown.Header icon="filter" content="Filter" />
              <Dropdown.Item
                active={filter === null}
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
              {videos
                ? videos.map((value, key) => {
                    if (Math.floor(key / 10) === page - 1) {
                      return (
                        <FavMovie
                          video={value}
                          key={key}
                          removeFunc={this.removeMovie}
                        />
                      );
                    }
                  })
                : null}
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
