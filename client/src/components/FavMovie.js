import React from 'react';
import { Item, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default function FavMovie({ video, removeFunc, removing }) {
  const date = new Date(video.date);
  return (
    <Item>
      <Item.Image
        as="a"
        href={`/movie/${video.video_data.vid}`}
        size="medium"
        src={video.video_data.preview_url}
        target="_blank"
      />
      <Item.Content>
        <Item.Header
          as="a"
          href={`/movie/${video.video_data.vid}`}
          target="_blank"
        >
          {video.video_data.title}
        </Item.Header>
        <Item.Meta>{date.toLocaleDateString()}</Item.Meta>
        <Item.Description>
          {video.video_data.keyword.split(' ').map((keyword, key) => {
            return (
              <NavLink key={key} to={`/search/${keyword}`}>
                {keyword}{' '}
              </NavLink>
            );
          })}
        </Item.Description>
        <Item.Extra>
          {video.video_data.viewnumber.toLocaleString()} views
        </Item.Extra>
        <Button
          loading={removing}
          icon="remove bookmark"
          floated="right"
          color="red"
          onClick={() => removeFunc(video._id)}
        />
      </Item.Content>
    </Item>
  );
}
