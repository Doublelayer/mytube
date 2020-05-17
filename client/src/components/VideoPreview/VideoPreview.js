import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { secondsToTime } from '../../utils/time-formatter';
import { STREAM_VIDEO, THUMB_VIDEO } from '../../services/url/api-endpoints';
import 'moment/locale/de';

import { VideoPlayer } from '../../utils/ComponentExporter';

import './VideoPreview.scss';

export default function VideoPreview(props) {
  const { video } = props;

  if (!video) {
    return <div />;
  }

  const horizontal = props.horizontal ? 'horizontal' : null;
  const expanded = props.expanded ? 'expanded' : null;
  const { _id, parent } = video;
  const { title } = video.itemInfo;

  return (
    <Link to={{ pathname: props.pathname, search: `id=${props.search}` }}>
      <div className={['video-preview', horizontal, expanded].join(' ')}>
        <div className="image-container">
          <VideoPlayer url={`${STREAM_VIDEO}/${_id}`} thumbnail={`${THUMB_VIDEO}/${_id}`} controls={false} playing={false} />
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
