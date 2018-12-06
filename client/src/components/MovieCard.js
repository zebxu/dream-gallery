import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';

const MovieCard = ({
  video,
  handleClick,
  saved,
  saved_id,
  scrollPos,
  lastPath
}) => (
  <Card centered fluid>
    <Image
      as="a"
      target="_blank"
      href={`https://avgle-viewer.herokuapp.com/movie/${video.vid}`}
      src={video.preview_url}
      fluid
      centered
    />

    <a
      href={`https://avgle-viewer.herokuapp.com/movie/${video.vid}`}
      target="_blank"
    >
      <ReactPlayer
        url={video.preview_video_url}
        playing
        loop
        width="100%"
        height="100%"
        playsinline
      />
    </a>

    <Card.Content textAlign="left">
      <Card.Header
        as="a"
        target="_blank"
        href={`https://avgle-viewer.herokuapp.com/movie/${video.vid}`}
        style={{ color: '#000' }}
      >
        {video.title}
      </Card.Header>
      <Card.Meta>
        <span>{video.viewnumber.toLocaleString()}</span>
        <Icon name="play circle outline" />
      </Card.Meta>
      <Card.Description>
        {video.keyword}
        <Button
          icon="remove bookmark"
          floated="right"
          onClick={() => handleClick(video, saved_id)}
          color={saved ? 'red' : 'grey'}
        />
      </Card.Description>
    </Card.Content>
  </Card>
);

export default withRouter(MovieCard);
