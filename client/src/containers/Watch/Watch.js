import React from 'react';
import { Video } from '../../utils/ComponentExporter';
import './Watch.scss';

export class Watch extends React.Component {
  render() {
    return (
      <div style={{ maxWidth: '80%' }}>
        <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
      </div>
    );
  }
}
