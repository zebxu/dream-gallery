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
  }
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    search_query: PropTypes.string,
    mode: PropTypes.string.isRequired
  };
  parseParams = () => {
    const params = new URLSearchParams(window.location.search);
    const params_obj = {
      order: params.get('o') ? params.get('o') : 'tr',
      time: params.get('t') ? params.get('t') : 'a',
      page: params.get('p') ? parseInt(params.get('p')) : 1,
      limit: params.get('limit') ? parseInt(params.get('limit')) : 10
    };
    return params_obj;
  };
  // Get data from avgle api
  getData = async () => {
    console.log('MovieList -> getData()');
    // this.setState({ fetchingMovieData: true });
    const params_obj = this.parseParams();
    const api_url = this.updateApiUrl(params_obj);
    console.log('request to ' + api_url);
    try {
      const res = await axios.get(api_url);
      if (res.status === 200) {
        // console.log(res.data);
        return res.data;
      } else {
        console.error('Can not fetch data');
      }
    } catch (err) {
      console.error(err);
    }
  };
  // Get data from firebase database
  getSavedData = async () => {
    console.log('MovieList -> getSavedData()');
    let val;
    await firebase
      .database()
      .ref('movies')
      .once('value', snap => {
        val = snap.val();
      });
    // console.log('getSavedData() val=', val);
    return val;
  };
  // Generate all remote data for the page
  // call getData() and getSavedData() and update state with result
  fetchData = async () => {
    this.setState({ fetchingMovieData: true, fetchingSavedData: true });
    const { order, time, page, limit } = this.parseParams();
    const avgle_p = this.getData();
    const user_p = this.getSavedData();
    const [avgle_data, user_data] = await Promise.all([avgle_p, user_p]);
    this.setState({
      savedMoviesList: user_data,
      saveButtonLoading: false,
      saveButtonKey: -1,
      fetchingSavedData: false,
      videos: avgle_data.response.videos,
      total_videos: avgle_data.response.total_videos,
      fetchingMovieData: false,
      order,
      time,
      page,
      limit
    });
  };
  // call fetchData() after first render
  async componentDidMount() {
    console.log('MovieList -> componentDidMount()');
    this.fetchData();
  }
  // Update api endpoint according
  updateApiUrl = params_obj => {
    console.log('MovieList -> updateApiUrl()');
    const { order, time, limit, page } = params_obj;
    let api_url;
    if (this.props.mode === 'VR') {
      api_url = `https://api.avgle.com/v1/videos/${page -
        1}?o=${order}&t=${time}&c=21&limit=${limit}`;
    } else if (this.props.mode === 'SEARCH') {
      const query = encodeURIComponent(this.props.match.params.search_query);
      console.log({ query });
      api_url = `https://api.avgle.com/v1/search/${query}/${page -
        1}?o=${order}&t=${time}&limit=${limit}`;
    } else if (this.props.mode === 'CH') {
      const ch_string = encodeURIComponent('中文字幕');
      api_url = `https://api.avgle.com/v1/search/${ch_string}/${page -
        1}?o=${order}&t=${time}&limit=${limit}`;
    } else if (this.props.mode === 'ALL') {
      api_url = `https://api.avgle.com/v1/videos/${page -
        1}?o=${order}&t=${time}&limit=${limit}`;
    } else {
      console.error('NO MODE is given to MovieList component');
    }
    return api_url;
  };
  // pagination onClick handler
  changePage = (event, data) => {
    console.log('MovieList -> changePage()');
    const { order, time } = this.state;
    this.setState({ page: data.activePage });
    this.props.history.push({
      search: `?o=${order}&t=${time}&p=${data.activePage}`
    });
    window.scrollTo(0, 0);
  };
  // save movie handler
  // video: video object
  // key: save button sequence number
  saveMovie = async (video, key) => {
    console.log('MovieList => saveMovie() => ', video, key);
    console.log({ key });
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    try {
      await firebase
        .database()
        .ref('movies')
        .push(video);
      console.log('save movie successed');
      const new_data = await this.getSavedData();
      this.setState({
        savedMoviesList: new_data,
        saveButtonLoading: false,
        saveButtonKey: -1,
        fetchingSavedData: false
      });
    } catch (err) {
      console.error(err);
    }
  };
  // remove movie handler
  // saved_id: unique id in firebase database
  // key: save button sequence number
  removeMovie = async (saved_id, key) => {
    console.log('MovieList => removeMovie()', saved_id, key);
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    try {
      await firebase
        .database()
        .ref('movies/' + saved_id)
        .remove()
        .then(() => {
          console.log('remove success');
        });
      const new_data = await this.getSavedData();
      this.setState({
        savedMoviesList: new_data,
        saveButtonLoading: false,
        saveButtonKey: -1,
        fetchingSavedData: false
      });
    } catch (err) {
      console.error(err);
    }
  };
  // save/remove multiplexer
  handleSaveButtonClick = (video, saved_id, key) => {
    if (saved_id) {
      this.removeMovie(saved_id, key);
    } else {
      this.saveMovie(video, key);
    }
  };
  // perform side effect if browser url is changed
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      this.fetchData();
    }
    console.log('componentDidUpdate()');
  }
  componentWillUnmount() {
    console.log('component will unmount');
  }
  renderPlaceholder = () => {
    return [...Array(10)].map((index, key) => <CardPlaceholder key={key} />);
  };
  render() {
    console.log('MovieList render');
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
        {this.props.mode === 'SEARCH' && (
          <p>
            Search result of '
            <strong>{this.props.match.params.search_query}'</strong>
          </p>
        )}

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
            <MainPagination
              activePage={page}
              totalPages={total_videos ? Math.ceil(total_videos / 10) : 1}
              changePage={this.changePage}
            />
          </GridColumn>
        </Grid>

        {total_videos === 0 && (
          <Message color="teal">
            <Message.Header>
              <Icon name="search" /> No video is found
            </Message.Header>
          </Message>
        )}

        {(fetchingMovieData || fetchingSavedData) &&
          [...Array(10)].map((index, key) => <CardPlaceholder key={key} />)}
        {!fetchingMovieData &&
          !fetchingSavedData &&
          videos.map((item, key) => {
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

        <MainPagination
          activePage={page}
          totalPages={total_videos ? Math.ceil(total_videos / 10) : 1}
          changePage={this.changePage}
        />
      </div>
    );
  }
}

export default withRouter(MovieList);
