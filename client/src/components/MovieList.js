import React from 'react';
import MovieCard from './MovieCard';
import MainPagination from './MainPagination';
import CardPlaceholder from './CardPlaceholder';
import { Dropdown, Grid, GridColumn, Icon, Message } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    console.log('MovieList -> constructor');
    this.state = {
      order: 'tr',
      time: 'a',
      limit: 10,
      page: 1,
      fetchingMovieData: true,
      fetchingSavedData: true,
      saveButtonLoading: false,
      saveButtonKey: -1
    };
    this.getData = this.getData.bind(this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    search_query: PropTypes.string,
    mode: PropTypes.string.isRequired
  };

  getSavedData = refresh => {
    console.log('MovieList -> getSavedData()');
    if (refresh) {
      this.setState({ fetchingSavedData: true });
    }
    const ref = firebase.database().ref('movies');
    ref.on('value', async snap => {
      console.log(snap.val());
      console.log(snap.numChildren());
      await this.setState({
        savedMoviesList: snap.val()
      });
      this.setState({
        saveButtonLoading: false,
        saveButtonKey: -1,
        fetchingSavedData: false
      });
    });
    // axios
    //   .get('/api/movies')
    //   .then(
    //     async res => {
    //       if (res.status === 200) {
    //         console.log({ getSavedData: res.data });
    //         await this.setState({ savedMoviesList: res.data.videos });
    //         this.setState({ saveButtonLoading: false, saveButtonKey: -1 });
    //       } else {
    //         console.log('get saved movie failed');
    //       }
    //     },
    //     err => {
    //       console.error(err);
    //     }
    //   )
    //   .then(() => {
    //     this.setState({ fetchingSavedData: false });
    //   });
  };

  async componentDidMount() {
    console.log('MovieList -> componentDidMount()');
    await this.updataApiUrl();
    await this.getData();
    await this.getSavedData(true);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      console.log({
        thisProp: this.props.location.search,
        prevProp: prevProps.location.search
      });
      await this.updataApiUrl();
      await this.getData();
      await this.getSavedData(true);
      await window.scrollTo(0, 0);
      document.body.style.zoom = 1.0;
    }
  }

  // Update api endpoint according to this.props.mode given by router
  updataApiUrl = () => {
    console.log('MovieList -> updateApiUrl()');
    const { order, time, limit, page } = this.state;
    if (this.props.mode === 'VR') {
      this.setState({
        api_url: `https://api.avgle.com/v1/videos/${page -
          1}?o=${order}&t=${time}&c=21&limit=${limit}`
      });
    } else if (this.props.mode === 'SEARCH') {
      const query = encodeURIComponent(this.props.match.params.search_query);
      console.log({ query });
      this.setState({
        api_url: `https://api.avgle.com/v1/search/${query}/${page -
          1}?o=${order}&t=${time}&limit=${limit}`
      });
    } else if (this.props.mode === 'CH') {
      const ch_string = encodeURIComponent('中文字幕');
      this.setState({
        api_url: `https://api.avgle.com/v1/search/${ch_string}/${page -
          1}?o=${order}&t=${time}&limit=${limit}`
      });
    } else if (this.props.mode === 'ALL') {
      this.setState({
        api_url: `https://api.avgle.com/v1/videos/${page -
          1}?o=${order}&t=${time}&limit=${limit}`
      });
    } else {
      console.error('NO MODE is given to MovieList component');
    }
  };

  getData = async () => {
    this.setState({ fetchingMovieData: true });
    const params = new URLSearchParams(window.location.search);
    await this.setState({
      order: params.get('o') ? params.get('o') : 'tr',
      time: params.get('t') ? params.get('t') : 'a',
      page: params.get('p') ? parseInt(params.get('p')) : 1
    });
    await this.updataApiUrl();
    const { api_url } = this.state;
    console.log('MovieList -> getData() ' + api_url);
    axios
      .get(api_url)
      .then(res => {
        if (res.status === 200) {
          // this.setState({ fetchingMovieData: false });
          console.log(res.data);
          this.setState({
            videos: res.data.response.videos,
            total_videos: res.data.response.total_videos
          });
        } else {
          console.error('Can not fetch data');
        }
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        this.setState({ fetchingMovieData: false });
      });
  };

  changePage = async (event, data) => {
    console.log('MovieList -> changePage()');
    const { order, time } = this.state;
    await this.setState({ page: data.activePage });
    await this.props.history.push({
      search: `?o=${order}&t=${time}&p=${data.activePage}`
    });
    await this.getData();
    await window.scrollTo(0, 0);
  };

  saveMovie = (video, key) => {
    console.log('MovieList => saveMovie() => ');
    console.log({ key });
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    const ref = firebase.database().ref('movies');
    ref.push(video).then(() => {
      console.log('save movie successed');
      this.getSavedData(false);
    });
    // axios
    //   .post('/api/movies', {
    //     video_data: { ...video, category: this.props.mode }
    //   })
    //   .then(res => {
    //     console.log(res);
    //     if (res.status === 201) {
    //       console.log('save movie successed');
    //       this.getSavedData(false);
    //     } else {
    //       console.log('save movie failed');
    //     }
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  };

  removeMovie = (saved_id, key) => {
    console.log('MovieList => removeMovie()');
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    const ref = firebase.database().ref('movies/' + saved_id);
    ref
      .remove()
      .then(() => {
        console.log('Remove succeeded.');
        this.getSavedData(false);
      })
      .catch(function(error) {
        console.log('Remove failed: ' + error.message);
      });

    // axios.delete(`/api/movies/${saved_id}`).then(
    //   res => {
    //     console.log(res);
    //     if (res.status === 200) {
    //       console.log('delete movie successed' + saved_id);
    //       this.getSavedData(false);
    //     } else {
    //       console.log('delete movie failed');
    //     }
    //   },
    //   err => console.log(err)
    // );
  };

  handleSaveButtonClick = (video, saved_id, key) => {
    if (saved_id) {
      this.removeMovie(saved_id, key);
    } else {
      this.saveMovie(video, key);
    }
  };

  // checkSaveSuccess = () => {
  //   console.log('MovieList -> checkSaveSuccess()');
  //   axios.get('/api/movies').then(
  //     async res => {
  //       if (res.status === 200) {
  //         console.log({ getSavedData: res.data });
  //         await this.setState({ savedMoviesList: res.data.videos });
  //         this.setState({ saveButtonLoading: false, saveButtonKey: -1 });
  //       } else {
  //         console.log('get saved movie failed');
  //       }
  //     },
  //     err => {
  //       console.error(err);
  //     }
  //   );
  // };

  // saveScrollPos = () => {
  //   // console.log('MovieList -> saveScrollPos()');
  //   this.setState({ scrollPos: document.scrollingElement.scrollTop });
  // };

  render() {
    const {
      videos,
      page,
      total_videos,
      order,
      time,
      savedMoviesList,
      scrollPos,
      fetchingMovieData,
      fetchingSavedData,
      saveButtonLoading,
      saveButtonKey
    } = this.state;

    return (
      <div>
        {this.props.mode === 'SEARCH' ? (
          <p>
            Search result of '
            <strong>{this.props.match.params.search_query}'</strong>
          </p>
        ) : null}

        <Grid columns={3} textAlign="left" stackable>
          <GridColumn textAlign="left" verticalAlign="bottom">
            <Dropdown
              text="Order"
              floating
              labeled
              className="icon"
              style={{ marginRight: '2rem' }}
            >
              <Dropdown.Menu>
                <Dropdown.Header icon="signal" content="Orders" />
                <Dropdown.Item active={order === 'mr'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=mr&t=${time}&p=1` }}
                    name="order"
                    value="mr"
                  >
                    Most Recent
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={order === 'mv'}>
                  <NavLink
                    to={{ search: `?o=mv&t=${time}&p=1` }}
                    activeStyle={{ color: '#000' }}
                    name="order"
                    value="mv"
                  >
                    Most Viewed
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={order === 'bw'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=bw&t=${time}&p=1` }}
                    name="order"
                    value="bw"
                  >
                    Being Watched
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={order === 'tr'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=tr&t=${time}&p=1` }}
                  >
                    Top Rated
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={order === 'tf'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=tf&t=${time}&p=1` }}
                  >
                    Top Favorites
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={order === 'lg'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=lg&t=${time}&p=1` }}
                  >
                    Longest
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown text="Time" floating labeled className="icon">
              <Dropdown.Menu>
                <Dropdown.Header icon="clock outline" content="Timeframe" />
                <Dropdown.Item active={time === 't'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=${order}&t=t&p=1` }}
                  >
                    1 Day
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={time === 'w'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=${order}&t=w&p=1` }}
                  >
                    1 Week
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={time === 'm'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=${order}&t=m&p=1` }}
                  >
                    1 Month
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item active={time === 'a'}>
                  <NavLink
                    activeStyle={{ color: '#000' }}
                    to={{ search: `?o=${order}&t=a&p=1` }}
                  >
                    Forever
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </GridColumn>

          <GridColumn textAlign="center">
            {fetchingMovieData ? null : (
              <MainPagination
                activePage={page}
                totalPages={total_videos ? Math.ceil(total_videos / 10) : 1}
                changePage={this.changePage}
              />
            )}
          </GridColumn>
        </Grid>

        {total_videos === 0 ? (
          <Message color="teal">
            <Message.Header>
              <Icon name="search" /> No video is found
            </Message.Header>
          </Message>
        ) : null}

        {fetchingMovieData || fetchingSavedData
          ? [...Array(10)].map((index, key) => <CardPlaceholder key={key} />)
          : videos.map((item, key) => {
              let saved = false;
              let saved_id = null;
              Object.keys(savedMoviesList).forEach((key, index) => {
                if (savedMoviesList[key].vid === item.vid) {
                  saved = true;
                  saved_id = key;
                }
              });
              return (
                <MovieCard
                  video={item}
                  key={key}
                  data_key={key}
                  saved={saved}
                  saved_id={saved_id}
                  handleClick={this.handleSaveButtonClick}
                  scrollPos={scrollPos}
                  lastPath={this.props.location}
                  isLoading={key === saveButtonKey && saveButtonLoading}
                />
              );
            })}

        {fetchingMovieData ? null : (
          <MainPagination
            activePage={page}
            totalPages={total_videos ? Math.ceil(total_videos / 10) : 1}
            changePage={this.changePage}
          />
        )}
      </div>
    );
  }
}

export default withRouter(MovieList);
