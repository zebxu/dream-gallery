import React, { Component } from 'react';
import { Item, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player';

export default class FavMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewControl: false
    };
  }
  render() {
    let { previewControl } = this.state;
    const { video, removeFunc, removing, remove_id } = this.props;
    const date = new Date(video.date);
    return (
      <Item>
        <Item.Image
          onClick={() => {
            this.setState({ previewControl: true });
          }}
          size="large"
          src={video.preview_url}
          onMouseEnter={() => {
            this.setState({ previewControl: true });
          }}
          onMouseOut={() => {
            this.setState({ previewControl: false });
          }}
        >
          {previewControl ? (
            <ReactPlayer
              url={video.preview_video_url}
              playing
              loop
              width="100%"
              height="100%"
              playsinline
            />
          ) : null}
        </Item.Image>
        <Item.Content>
          <Item.Header
            as="a"
            href={`/movie/${video.vid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.title}
          </Item.Header>
          <Item.Meta>{date.toLocaleDateString()}</Item.Meta>
          <Item.Description>
            {video.keyword.split(' ').map((keyword, key) => {
              return (
                <NavLink key={key} to={`/search/${keyword}`}>
                  {keyword}{' '}
                </NavLink>
              );
            })}
          </Item.Description>
          <Item.Extra>{video.viewnumber.toLocaleString()} views</Item.Extra>
          <Button
            loading={removing}
            icon="remove bookmark"
            floated="right"
            color="red"
            onClick={() => removeFunc(remove_id)}
            style={{ marginTop: '9.2rem', marginRight: '1rem' }}
          />
        </Item.Content>
      </Item>
    );
  }
}
