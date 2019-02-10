import React from 'react';
import { Item, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default function FavMovie({ video, removeFunc, removing, remove_id }) {
  const date = new Date(video.date);
  return (
    <Item>
      <Item.Image
        as="a"
        href={`/movie/${video.vid}`}
        size="medium"
        src={video.preview_url}
      />
      <Item.Content>
        <Item.Header as="a" href={`/movie/${video.vid}`}>
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
        />
      </Item.Content>
    </Item>
  );
}
