import React from 'react';
import ReactPlayer from 'react-player';
import './Video.scss';

export default function Video(props) {
  if (!props.url) return null;

  return (
    <div className="video-container">
      <div className="video">
        <ReactPlayer url={props.url} width="100%" height="100%" controls={props.controls} playing={props.playing} light={props.light} />
        {/* <ReactPlayer url="#" width="100%" height="100%" controls={props.controls} playing={props.playing} /> */}
      </div>
    </div>
  );
}
