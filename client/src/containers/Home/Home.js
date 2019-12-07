import React from 'react';
import './Home.scss';
import { HomeContent, SideBar } from '../../utils/ComponentExporter';
import { mostPopularVideosLoaded } from '../../store/reducers/video';

import { connect } from 'react-redux';
import * as videoActions from '../../store/actions/video';
import { bindActionCreators } from 'redux';

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <HomeContent bottomReachedCallback={this.bottomReachedCallback} showLoader={this.props.isFetching} />
      </React.Fragment>
    );
  }
  componentDidMount() {
    this.props.actions.fetchMostPopular(0, 40);
  }

  bottomReachedCallback = () => {
    if (!this.props.mostPopularVideosLoaded && !this.props.isFetching) {
      return;
    }

    this.props.actions.fetchMostPopular(this.props.nextSkip, 10);
  };
}

function mapStateToProps(state) {
  return {
    mostPopularVideosLoaded: mostPopularVideosLoaded(state),
    nextSkip: state.videos.byCategory.mostPopular.nextSkip,
    isFetching: state.videos.byCategory.mostPopular.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  const fetchMostPopular = videoActions.mostPopular.request;

  return {
    actions: bindActionCreators({ fetchMostPopular }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
