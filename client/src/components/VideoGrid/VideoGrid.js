import React from 'react';

import { Divider } from 'semantic-ui-react';
import { VideoPreview, VideoGridHeader } from '../../utils/ComponentExporter';

import './VideoGrid.scss';

export function VideoGrid(props) {

  if (!props.videos || !props.videos.length) {
    return <div />;
  }

  const gridItems = props.videos.map(video => {
    return <VideoPreview video={video} key={video._id} pathname="/watch" search={video._id} />;
  });

  const divider = props.hideDivider ? null : <Divider />;
  return (
    <React.Fragment>
      <div className="video-section">
        <VideoGridHeader title={props.title} />
        <div className="video-grid">{gridItems}</div>
      </div>
      {divider}
    </React.Fragment>
  );
}
