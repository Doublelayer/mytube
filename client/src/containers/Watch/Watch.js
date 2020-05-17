import React from 'react';
import { bindActionCreators } from 'redux';
import * as watchActions from '../../store/actions/watch';
import * as videoActions from '../../store/actions/video';
import { getVideoById, getRelatedVideos } from '../../store/reducers/video';
import { getSearchParam } from '../../services/url/index';
import { STREAM_VIDEO } from '../../services/url/api-endpoints';

import { connect } from 'react-redux';
import { VideoPlayer, RelatedVideos, VideoMetadata, VideoInfoBox, Comments } from '../../utils/ComponentExporter';
import './Watch.scss';

class Watch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sameFolderFetched: false };
  }

  render() {
    console.log(this.props.now);
    if (!this.props.now) {
      return <div />;
    }

    const { _id, statistics, itemInfo, parent, publishedAt } = this.props.now;
    const { relatedVideos } = this.props;
    console.log(relatedVideos);

    return (
      <div className="watch-grid">
        <VideoPlayer class="video" url={`${STREAM_VIDEO}/${_id}`} controls={true} playing={false} light={false} />
        <VideoMetadata viewCount={statistics.viewCount} title={itemInfo.title} />
        <VideoInfoBox parent={parent} publishedAt={publishedAt} description={itemInfo.description} />
        <Comments />
        <RelatedVideos relatedVideos={relatedVideos} />
      </div>
    );
  }

  componentDidUpdate() {
    const video = this.props.now;

    if (video && !this.state.sameFolderFetched) {
      this.props.watch.fetchSameFolder({ parent: video.parent });
      this.setState({ sameFolderFetched: true });
    }
  }

  componentDidMount() {
    const videoId = this.getVideoId();
    if (!videoId) {
      this.props.history.push('/');
    }

    const video = this.props.now;
    if (video) {
      this.props.watch.now(video._id);
      this.props.watch.fetchSameFolder({ parent: video.parent });
    } else {
      this.props.watch.fetchWatchDetails(videoId);
    }
  }

  getVideoId() {
    return getSearchParam(this.props.location, 'id');
  }
}

function mapStateToProps(state, props) {
  return {
    now: getVideoById(state, getSearchParam(props.location, 'id')),
    relatedVideos: getRelatedVideos(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchWatchDetails = watchActions.details.request;
  const fetchMostPopular = videoActions.mostPopular.request;
  const fetchSameFolder = watchActions.sameFolder.request;
  const now = watchActions.watch.now;
  return {
    watch: bindActionCreators({ fetchWatchDetails, fetchMostPopular, now, fetchSameFolder }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Watch);
