import React from 'react';
import './Home.scss';
import { VideoGrid, SideBar } from '../../utils/ComponentExporter';

export class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <div className="home">
          <div className="responsive-video-grid-container">
            <VideoGrid title="Trending" />
            <VideoGrid title="Autos & Vehicles" hideDivider={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
