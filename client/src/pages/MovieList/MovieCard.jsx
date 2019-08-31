import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const MovieCard = ({
  video,
  handleClick,
  saved,
  saved_id,
  isLoading,
  data_key
}) => (
  <Card centered fluid>
    <Image
      as="a"
      rel="noopener noreferrer"
      href={`/movie/${video.vid}`}
      src={video.preview_url}
      fluid
      centered
      target="_blank"
    />

    <a href={`/movie/${video.vid}`} target="_blank" rel="noopener noreferrer">
      <video
        src={video.preview_video_url}
        width="100%"
        height="100%"
        autoPlay
        loop
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </a>

    <Card.Content textAlign="left">
      <Card.Header
        as="a"
        target="_blank"
        href={`/movie/${video.vid}`}
        style={{ color: '#000' }}
        rel="noopener noreferrer"
      >
        {video.title}
      </Card.Header>
      <Card.Meta>
        <span>{video.viewnumber.toLocaleString()}</span>
        <Icon name="play circle outline" />
      </Card.Meta>
      <Card.Description>
        {video.keyword.split(' ').map((keyword, key) => {
          return (
            <NavLink key={key} to={`/search/${keyword}`}>
              {keyword}{' '}
            </NavLink>
          );
        })}
        <Button
          loading={isLoading}
          icon="remove bookmark"
          floated="right"
          onClick={() => handleClick(video, saved_id, data_key)}
          color={saved ? 'red' : 'grey'}
        />
      </Card.Description>
    </Card.Content>
  </Card>
);

export default MovieCard;
