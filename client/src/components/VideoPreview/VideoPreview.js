import React, { Component } from 'react';
import { Video } from '../../utils/ComponentExporter';

import './VideoPreview.scss';

class VideoPreview extends Component {
  render() {
    const horizontal = this.props.horizontal ? 'horizontal' : null;
    const expanded = this.props.expanded ? 'expanded' : null;

    return (
      <div className={['video-preview', horizontal, expanded].join(' ')}>
        <div className="image-container">
          <Video url="http://localhost:5000/stream/1" controls={false} playing={false} />
          <div className="time-label">
            <span>05:22</span>
          </div>
        </div>
        <div className="video-info">
          <div className="semi-bold show-max-two-lines">Video title</div>
          <div className="video-preview-metadata-container">
            <div className="channel-title">Channel title</div>
            <div>
              <span>2.1M views • 2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPreview;
