import React from 'react';
import { VideoGrid, InfiniteScroll } from '../../utils/Exporter';
import './HomeContent.scss';

import { getNextVideosFromStore, getNextPage, getIsVideoFetching, getTotalPages, getActualPage } from '../../store/reducers/video';
import { connect } from 'react-redux';
import * as videoActions from '../../store/actions/video';
import { bindActionCreators } from 'redux';

class HomeContent extends React.Component {
  render() {
    const { videos, isFetching } = this.props;

    return (
      <div className="home-content">
        <div className="responsive-video-grid-container">
          <InfiniteScroll bottomReachedCallback={this.bottomReachedCallback} showLoader={isFetching}>
            <VideoGrid title="Trending" videos={videos} />
            {/* <VideoGrid title="Autos & Vehicles" hideDivider={true} /> */}
          </InfiniteScroll>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { nextPage, limit } = this.props;
    const projection = {
      thumbnail: 0,
    };

    this.props.actions.fetchMostPopular(nextPage, limit, projection);
  }

  bottomReachedCallback = () => {
    const { actualPage, totalPages, nextPage, limit, isFetching } = this.props;

    if (actualPage < totalPages && !isFetching) {
      this.props.actions.fetchMostPopular(nextPage, limit);
    }
  };
}

function mapStateToProps(state) {
  return {
    videos: getNextVideosFromStore(state),
    nextPage: getNextPage(state),
    isFetching: getIsVideoFetching(state),
    totalPages: getTotalPages(state),
    actualPage: getActualPage(state),
    limit: 40,
  };
}

function mapDispatchToProps(dispatch) {
  const fetchMostPopular = videoActions.mostPopular.request;

  return {
    actions: bindActionCreators({ fetchMostPopular }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
