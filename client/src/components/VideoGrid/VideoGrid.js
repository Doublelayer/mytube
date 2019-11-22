import React from 'react';
import './VideoGrid.scss';
import { Divider } from 'semantic-ui-react';
import { VideoPreview, VideoGridHeader } from '../../utils/ComponentExporter';

export function VideoGrid(props) {
  const divider = props.hideDivider ? null : <Divider />;
  return (
    <React.Fragment>
      <div className="video-section">
        <VideoGridHeader title={props.title} />
        <div className="video-grid">
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
          <VideoPreview />
        </div>
      </div>
      {divider}
    </React.Fragment>
  );
}
