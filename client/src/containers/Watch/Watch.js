import React from 'react';
import { Video, RelatedVideos, VideoMetadata, VideoInfoBox, Comments } from '../../utils/ComponentExporter';
import './Watch.scss';

export class Watch extends React.Component {
  render() {
    return (
      <div className="watch-grid">
        <Video class="video" url="http://localhost:5000/stream/1" controls={true} playing={true} />
        <VideoMetadata />
        <VideoInfoBox />
        <Comments />
        <RelatedVideos className="relatedVideos" />
      </div>
    );
  }
}
