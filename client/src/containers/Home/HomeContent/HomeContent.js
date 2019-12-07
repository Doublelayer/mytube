import React from 'react';
import { VideoGrid, InfiniteScroll } from '../../../utils/ComponentExporter';
import './HomeContent.scss';

import { getMostPopularVideos } from '../../../store/reducers/video';
import { connect } from 'react-redux';

class HomeContent extends React.Component {
  render() {
    const trendingVideos = this.getTrendingVideos();

    return (
      <div className="home-content">
        <div className="responsive-video-grid-container">
          <InfiniteScroll bottomReachedCallback={this.props.bottomReachedCallback} showLoader={this.props.showLoader}>
            <VideoGrid title="Trending" videos={trendingVideos} />
            {/* <VideoGrid title="Autos & Vehicles" hideDivider={true} /> */}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
  getTrendingVideos() {
    return this.props.mostPopularVideos.sort((a, b) => b.statistics.viewCount - a.statistics.viewCount);
  }
}

function mapStateToProps(state) {
  return {
    mostPopularVideos: getMostPopularVideos(state)
  };
}
export default connect(mapStateToProps, null)(HomeContent);
