import React from 'react';
import { VideoGrid } from '../../../utils/ComponentExporter';
import './HomeContent.scss';

import { getMostPopularVideos } from '../../../store/reducers/video';
import { connect } from 'react-redux';

class HomeContent extends React.Component {
  render() {
    const trendingVideos = this.getTrendingVideos();

    return (
      <div className="home-content">
        <div className="responsive-video-grid-container">
          <VideoGrid title="Trending" videos={trendingVideos} />
          {/* <VideoGrid title="Autos & Vehicles" hideDivider={true} /> */}
        </div>
      </div>
    );
  }
  getTrendingVideos() {
    return this.props.mostPopularVideos;
  }
}

function mapStateToProps(state) {
  return {
    mostPopularVideos: getMostPopularVideos(state)
  };
}
export default connect(mapStateToProps, null)(HomeContent);
