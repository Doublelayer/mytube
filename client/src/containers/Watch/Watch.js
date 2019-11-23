import React from 'react';
import { Video, RelatedVideos } from '../../utils/ComponentExporter';
import './Watch.scss';

export class Watch extends React.Component {
  render() {
    return (
      <div className="watch-grid">
        <Video class="video" url="http://localhost:5000/stream/1" controls={true} playing={true} />
        <div className="metadata" style={{ width: '100%', height: '100px', background: '#F91112' }}>
          Metadata
        </div>
        <div className="video-info-box" style={{ width: '100%', height: '100px', background: '#BD10E0' }}>
          Video Info box
        </div>
        <div className="comments" style={{ width: '100%', height: '100px', background: '#9013FE' }}>
          comments
        </div>
        <RelatedVideos className="relatedVideos" />
      </div>
    );
  }
}
