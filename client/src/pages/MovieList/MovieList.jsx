import React from 'react';
import MovieCard from './MovieCard';
import MainPagination from '../../widgets/MainPagination';
import CardPlaceholder from '../../widgets/CardPlaceholder';
import { Dropdown, Grid, GridColumn, Icon, Message } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import qs from 'query-string';

class MovieList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'tr',
      time: 'a',
      limit: 250,
      page: 1,
      fetchingMovieData: true,
      fetchingSavedData: true,
      saveButtonLoading: false,
      saveButtonKey: -1,
      fetchIteration: 0,
      videos: []
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
      limit: params.get('limit') ? parseInt(params.get('limit')) : 250
    };
    return params_obj;
  };
  // Get data from avgle api
  getData = async () => {
    // this.setState({ fetchingMovieData: true });
    const params_obj = this.parseParams();
    const api_url = this.updateApiUrl(params_obj);

    try {
      const res = await axios.get(api_url);
      if (res.status === 200) {
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
    let val;
    await firebase
      .database()
      .ref('movies')
      .once('value', snap => {
        val = snap.val();
      });

    const vid_set = new Set(Object.values(val).map(i => i.vid));
    const save_id_map = new Map();
    for (let i of Object.entries(val)) {
      save_id_map.set(i[1].vid, i[0]);
      vid_set.add(i.vid);
    }

    return { vid_set, save_id_map };
  };
  // Parent function of all fetch functions
  // Generate all remote data for the page
  // call getData() and getSavedData() and update state with result
  fetchData = async (new_iteration = true) => {
    await this.setState({
      fetchingMovieData: true,
      fetchingSavedData: true,
      fetchIteration: new_iteration ? 0 : this.state.fetchIteration,
      videos: new_iteration ? [] : this.state.videos
    });
    const { order, time, page, limit } = this.parseParams();
    const avgle_p = this.getData();
    const user_p = this.getSavedData();
    const [avgle_data, user_data] = await Promise.all([avgle_p, user_p]);
    const { vid_set, save_id_map } = user_data;
    this.setState({
      savedMoviesSet: vid_set,
      savedMoviesMap: save_id_map,
      saveButtonLoading: false,
      saveButtonKey: -1,
      fetchingSavedData: false,
      videos: this.state.videos.concat(avgle_data.response.videos),
      total_videos: avgle_data.response.total_videos,
      fetchingMovieData: false,
      fetchIteration: this.state.fetchIteration + 1,
      order,
      time,
      page,
      limit
    });
  };
  // call fetchData() after first render
  async componentDidMount() {
    this.fetchData();
  }
  // Update api endpoint according
  updateApiUrl = params_obj => {
    const { fetchIteration } = this.state;
    const { order, time, limit } = params_obj;

    let api_url;
    if (this.props.mode === 'VR') {
      api_url = `https://api.avgle.com/v1/videos/${fetchIteration}?o=${order}&t=${time}&c=21&limit=${limit}`;
    } else if (this.props.mode === 'SEARCH') {
      const query = encodeURIComponent(this.props.match.params.search_query);
      api_url = `https://api.avgle.com/v1/search/${query}/${fetchIteration}?o=${order}&t=${time}&limit=${limit}`;
    } else if (this.props.mode === 'CH') {
      const ch_string = encodeURIComponent('中文字幕');
      api_url = `https://api.avgle.com/v1/search/${ch_string}/${fetchIteration}?o=${order}&t=${time}&limit=${limit}`;
    } else if (this.props.mode === 'ALL') {
      api_url = `https://api.avgle.com/v1/videos/${fetchIteration}?o=${order}&t=${time}&limit=${limit}`;
    } else {
      console.error('NO MODE is given to MovieList component');
    }
    return api_url;
  };
  // pagination onClick handler
  changePage = (event, data) => {
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
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    try {
      await firebase
        .database()
        .ref('movies')
        .push(video);

      const new_data = await this.getSavedData();
      const { vid_set, save_id_map } = new_data;
      this.setState({
        savedMoviesSet: vid_set,
        savedMoviesMap: save_id_map,
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
    this.setState({ saveButtonLoading: true, saveButtonKey: key });
    try {
      await firebase
        .database()
        .ref('movies/' + saved_id)
        .remove()
        .then(() => { });
      const new_data = await this.getSavedData();
      const { vid_set, save_id_map } = new_data;
      this.setState({
        savedMoviesSet: vid_set,
        savedMoviesMap: save_id_map,
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
  // prevent fetching data when only page is changed
  // most data is cached
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      if (
        this.onlyPageChange(prevProps) &&
        this.props.mode === prevProps.mode
      ) {
        if (this.exceedCache()) {
          // parameter new_iteration = false
          this.fetchData(false);
        }
        return;
      } else {
        window.scrollTo(0, 0);
        this.fetchData();
      }
    }
  }
  // identify the event that only page is changed so no need to fetch data
  // return false if a re fetch is needed
  onlyPageChange = prevProps => {
    const now_params = qs.parse(this.props.location.search);
    const before_params = qs.parse(prevProps.location.search);

    // when doing search during a search result page
    // a re fetch is required
    if (
      this.props.mode === 'SEARCH' &&
      this.props.match.params.search_query !==
      prevProps.match.params.search_query
    ) {
      return false;
    }

    // when go from a landing page to a sub page and the o t params remain as default, this also satisfy the condition
    if (
      Object.keys(before_params).length === 0 &&
      Object.keys(now_params).length !== 0 &&
      now_params['o'] === 'tr' &&
      now_params['t'] === 'a'
    ) {
      return true;
    }
    // compare the changing of URL search params
    for (let i in now_params) {
      if (before_params[i]) {
        if (before_params[i] !== now_params[i] && i !== 'p') {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  };
  // check if a fetch more is needed
  exceedCache = () => {
    const { videos, page, fetchingMovieData, fetchingSavedData } = this.state;
    if (!fetchingMovieData && !fetchingSavedData) {
      if (10 * (page - 1) + 9 > videos.length) {
        // fetch more

        return true;
      } else {
        return false;
      }
    }
  };
  render() {
    const {
      videos,
      page,
      total_videos,
      order,
      time,
      savedMoviesSet,
      savedMoviesMap,
      scrollPos,
      fetchingMovieData,
      fetchingSavedData,
      saveButtonLoading,
      saveButtonKey
    } = this.state;
    let renderedVideos;
    // calculate movie list range for this page
    if (!fetchingMovieData && !fetchingSavedData) {
      renderedVideos = videos.slice(10 * (page - 1), 10 * (page - 1) + 10);

      //   'rendering video range: ',
      //   10 * (page - 1),
      //   10 * (page - 1) + 10
      // );
    }
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
            {!fetchingMovieData && !fetchingSavedData && (
              <MainPagination
                activePage={page}
                totalPages={total_videos ? Math.ceil(total_videos / 10) : 1}
                changePage={this.changePage}
              />
            )}
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
          renderedVideos.map((item, key) => {
            let saved = false;
            let saved_id = null;
            if (savedMoviesSet.has(item.vid)) {
              saved = true;
              saved_id = savedMoviesMap.get(item.vid);
            }
            return (
              <MovieCard
                video={item}
                key={item.vid}
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
