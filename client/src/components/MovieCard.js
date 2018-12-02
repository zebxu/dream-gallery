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
      as={Link}
      to={{
        pathname: `/movie/${video.vid}`,
        state: { scrollPos: scrollPos, lastPath: lastPath }
      }}
      src={video.preview_url}
      fluid
      centered
    />

    <Link
      to={{
        pathname: `/movie/${video.vid}`,
        state: { scrollPos: scrollPos }
      }}
    >
      <ReactPlayer
        url={video.preview_video_url}
        playing
        loop
        width="100%"
        height="100%"
        playsinline
      />
    </Link>

    <Card.Content textAlign="left">
      <Card.Header
        as={NavLink}
        to={{
          pathname: `/movie/${video.vid}`,
          state: { scrollPos: scrollPos }
        }}
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
