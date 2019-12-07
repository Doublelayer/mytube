import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { secondsToTime } from '../../utils/time-formatter';
import 'moment/locale/de';

import { Video } from '../../utils/ComponentExporter';

import './VideoPreview.scss';

class VideoPreview extends Component {
  render() {
    const { video } = this.props;

    if (!video) {
      return <div />;
    }

    const horizontal = this.props.horizontal ? 'horizontal' : null;
    const expanded = this.props.expanded ? 'expanded' : null;
    const { _id, thumbnail, parent } = video;
    const { title } = video.itemInfo;

    return (
      <Link to={{ pathname: this.props.pathname, search: `id=${this.props.search}` }}>
        <div className={['video-preview', horizontal, expanded].join(' ')}>
          <div className="image-container">
            <Video url={`${thumbnail}`} controls={false} playing={false} />
            <div className="time-label">
              <span>{secondsToTime(video.duration)}</span>
            </div>
          </div>
          <div className="video-info">
            <div className="semi-bold show-max-two-lines">{title}</div>
            <div className="video-preview-metadata-container">
              <div>
                <div className="channel-title">{parent}</div>
                <div className="view-and-time">
                  {video.statistics.viewCount} Aufrufe • <Moment fromNow>{video.publishedAt}</Moment>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default VideoPreview;
