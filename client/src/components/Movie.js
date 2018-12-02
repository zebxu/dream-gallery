import React from 'react';
import Navbar from './Navbar';
import {
  Container,
  Divider,
  Segment,
  Button,
  Card,
  Icon,
  Loader,
  Placeholder
} from 'semantic-ui-react';
import Footer from './Footer';
import axios from 'axios';
import Iframe from 'react-iframe';

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      saved: false,
      saved_id: null
    };
    this.getSavedData = this.getSavedData.bind(this);
  }

  removeMovie = () => {
    const { saved_id } = this.state;
    axios.delete(`/api/movies/${saved_id}`).then(
      res => {
        console.log(res);
        if (res.status === 200) {
          console.log('delete movie successed' + saved_id);
          this.setState({ saved: false });
          this.fetchMovieData();
        } else {
          console.log('delete movie failed');
        }
      },
      err => console.log(err)
    );
  };

  saveMovie = () => {
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
          this.fetchMovieData();
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

  getSavedData = () => {
    axios.get('/api/movies').then(
      res => {
        if (res.status === 200) {
          res.data.videos.forEach((video, index) => {
            if (video.video_data.vid === this.state.vid) {
              console.log('find saved!!');
              this.setState({ saved: true, saved_id: video._id });
            }
          });
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
    axios
      .get(`https://api.avgle.com/v1/video/${this.props.match.params.vid}`)
      .then(res => {
        console.log('featch movie data', res);
        if (res.data.success) {
          this.setState({
            ...res.data.response.video,
            video: res.data.response.video
          });
        } else {
          console.error('Video Not Found');
          this.setState({ notFound: true });
        }
        this.getSavedData();
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.fetchMovieData();
    console.log('didMount -> scrollPos');
    window.onpopstate = e => {
      console.log('window.onpopstate');
      if (this.props.location.state) {
        this.props.history.push({
          ...this.props.location.state.lastPath,
          state: { scrollPos: this.props.location.state.scrollPos }
        });
      }
    };
    // window.addEventListener('beforeunload', function(e) {
    //   // Cancel the event as stated by the standard.
    //   e.preventDefault();
    //   // Chrome requires returnValue to be set.
    //   e.returnValue = '';
    // });
  }

  render() {
    const {
      title,
      embedded_url,
      notFound,
      keyword,
      viewnumber,
      duration,
      saved
    } = this.state;
    if (embedded_url) {
      return (
        <>
          <Navbar />
          <Container>
            <h1>{title}</h1>

            <Segment as={Card} fluid>
              {notFound ? (
                <span>Movie not found</span>
              ) : embedded_url ? (
                <Iframe
                  title="avgle"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allowFullScreen
                  referrerpolicy="no-referrer"
                  url={embedded_url}
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
                  {keyword}
                  <Button
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
          </Container>
          <Divider />
          <Footer />
        </>
      );
    } else {
      return (
        <>
          <Navbar />
          <Container>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Container>
        </>
      );
    }
  }
}

export default Movie;
