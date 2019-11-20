import React from 'react';
import './Home.scss';
import { VideoPreview } from '../../utils/ComponentExporter';

export class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <VideoPreview />
      </div>
    );
  }
}
