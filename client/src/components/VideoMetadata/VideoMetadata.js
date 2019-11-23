import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import './VideoMetadata.scss';

export function VideoMetadata(props) {
  const viewCount = props.viewCount ? Number(props.viewCount).toLocaleString() || '' : 0;
  const videoTitle = props.title;

  return (
    <div className="video-metadata">
      <h3>{videoTitle}</h3>
      <div className="video-stats">
        <span>{viewCount} Aufrufe</span>
        <div>{/*TODO*/}</div>
      </div>
      <Divider />
    </div>
  );
}
