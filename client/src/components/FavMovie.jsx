import React, { Component } from 'react';
import { Item, Button, Responsive, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player';

export default class FavMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewControl: false
    };
  }
  toggolePreview = () => {
    const { previewControl } = this.state;
    this.setState({ previewControl: !previewControl });
  };
  render() {
    let { previewControl } = this.state;
    const { video, removeFunc, removing, remove_id } = this.props;
    const date = new Date(video.date);
    return (
      <>
        <Responsive minWidth={768} as={Item}>
          <Item.Image
            size="large"
            onMouseOut={() => {
              console.log('mouse out');
              const { previewControl } = this.state;
              this.setState({ previewControl: !previewControl });
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
            ) : (
              <Image
                size="large"
                src={video.preview_url}
                onMouseEnter={() => {
                  console.log('mouse enter');
                  this.setState({ previewControl: true });
                }}
              />
            )}
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
        </Responsive>

        <Responsive {...Responsive.onlyMobile} as={Item}>
          <Item.Image
            onClick={this.toggolePreview}
            size="large"
            src={video.preview_url}
          >
            {previewControl ? (
              <div style={{ width: '300px', height: '170px' }}>
                <ReactPlayer
                  url={video.preview_video_url}
                  playing
                  loop
                  width="100%"
                  height="100%"
                  playsinline
                />
              </div>
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
              style={{ marginRight: '1rem' }}
            />
          </Item.Content>
        </Responsive>
      </>
    );
  }
}
