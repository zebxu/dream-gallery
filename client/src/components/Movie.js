import React from 'react';
import Navbar from './Navbar';
import {
  Container,
  Divider,
  Segment,
  Button,
  Card,
  Icon,
  Loader
} from 'semantic-ui-react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import CardPlaceholder from './CardPlaceholder';

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      saved: false,
      saved_id: null,
      fetchingMovieData: true,
      fetchingSavedData: true,
      saveButtonIsLoading: false
    };
    this.getSavedData = this.getSavedData.bind(this);
  }

  removeMovie = () => {
    this.setState({ saveButtonIsLoading: true });
    const { saved_id } = this.state;
    axios.delete(`/api/movies/${saved_id}`).then(
      res => {
        console.log(res);
        if (res.status === 200) {
          console.log('delete movie successed' + saved_id);
          this.getSavedData(false);
        } else {
          console.log('delete movie failed');
        }
      },
      err => console.log(err)
    );
  };

  saveMovie = () => {
    this.setState({ saveButtonIsLoading: true });
    const category = this.state.video.channel === '21' ? 'VR' : 'CH';
    console.log('channel', this.state.video.channel);
    axios
      .post('/api/movies', {
        video_data: { ...this.state.video, category }
      })
      .then(res => {
        console.log(res);
        if (res.status === 201) {
          console.log('save movie successed');
          this.getSavedData(false);
        } else {
          console.log('save movie failed');
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleSaveButtonClick = () => {
    const { saved } = this.state;
    if (saved) {
      this.removeMovie();
    } else {
      this.saveMovie();
    }
  };

  getSavedData = refresh => {
    if (refresh) {
      this.setState({ fetchingSavedData: true });
    }
    axios.get('/api/movies').then(
      async res => {
        await this.setState({ saved: false });
        if (res.status === 200) {
          await res.data.videos.forEach((video, index) => {
            if (video.video_data.vid === this.state.vid) {
              console.log('find saved!!');
              this.setState({ saved: true, saved_id: video._id });
            }
          });
          await this.setState({ fetchingSavedData: false });
          this.setState({ saveButtonIsLoading: false });
        } else {
          console.log('get saved movie failed');
        }
      },
      err => {
        console.error(err);
      }
    );
  };

  fetchMovieData = () => {
    this.setState({ fetchingMovieData: true });
    axios
      .get(`https://api.avgle.com/v1/video/${this.props.match.params.vid}`)
      .then(async res => {
        console.log('featch movie data', res);
        if (res.data.success) {
          await this.setState({
            ...res.data.response.video,
            video: res.data.response.video
          });
          this.setState({ fetchingMovieData: false });
        } else {
          console.error('Video Not Found');
          this.setState({ notFound: true });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.fetchMovieData();
    this.getSavedData(true);
  }

  render() {
    const {
      title,
      embedded_url,
      notFound,
      keyword,
      viewnumber,
      duration,
      saved,
      fetchingMovieData,
      fetchingSavedData,
      saveButtonIsLoading
    } = this.state;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Navbar />
        <Container>
          {fetchingMovieData || fetchingSavedData ? (
            <CardPlaceholder />
          ) : (
            <div>
              <h1>{title}</h1>

              <Segment as={Card} fluid>
                {notFound ? (
                  <span>Movie not found</span>
                ) : embedded_url ? (
                  <iframe
                    src={embedded_url}
                    title="avgle"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    allowFullScreen
                    referrerpolicy="always"
                  />
                ) : (
                  <Loader />
                )}
                <Card.Content>
                  <Card.Meta>
                    {`${Math.floor(duration / 3600)}:${Math.floor(
                      (duration % 3600) / 60
                    )}:${Math.floor(duration % 60)}`}
                  </Card.Meta>
                  <Card.Description>
                    {keyword.split(' ').map((keyword, key) => {
                      return (
                        <NavLink to={`/search/${keyword}`} key={key}>
                          {keyword}{' '}
                        </NavLink>
                      );
                    })}
                    <Button
                      loading={saveButtonIsLoading}
                      icon="remove bookmark"
                      floated="right"
                      color={saved ? 'red' : 'grey'}
                      onClick={this.handleSaveButtonClick}
                    />
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <span>
                    <Icon name="eye" />
                    {parseInt(viewnumber).toLocaleString()} views
                  </span>
                </Card.Content>
              </Segment>
            </div>
          )}
        </Container>
        <Divider />
      </div>
    );
  }
}

export default Movie;
