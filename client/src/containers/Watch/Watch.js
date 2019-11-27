import React from 'react';
import { bindActionCreators } from 'redux';
import * as watchActions from '../../store/actions/watch';
import { getVideoById } from '../../store/reducers/video';
import { getSearchParam } from '../../services/url/index';
import { connect } from 'react-redux';
import { Video, RelatedVideos, VideoMetadata, VideoInfoBox, Comments } from '../../utils/ComponentExporter';
import './Watch.scss';

class Watch extends React.Component {
  render() {
    if (!this.props.video) {
      return <div />;
    }
    const { streamUrl, _id, statistics, itemInfo } = this.props.video;
    console.log(this.props.video);

    return (
      <div className="watch-grid">
        <Video class="video" url={`${streamUrl}?id=${_id}`} controls={true} playing={true} />
        <VideoMetadata viewCount={statistics.viewCount} title={itemInfo.title} />
        <VideoInfoBox />
        <Comments />
        <RelatedVideos className="relatedVideos" />
      </div>
    );
  }

  componentDidMount() {
    this.fetchWatchContent();
  }

  fetchWatchContent() {
    const videoId = this.getVideoId();
    if (!videoId) {
      this.props.history.push('/');
    }
    this.props.watch.fetchWatchDetails(videoId);
  }

  getVideoId() {
    return getSearchParam(this.props.location, 'id');
  }
}

function mapStateToProps(state, props) {
  return {
    video: getVideoById(state, getSearchParam(props.location, 'id'))
  };
}

function mapDispatchToProps(dispatch) {
  const fetchWatchDetails = watchActions.details.request;
  return {
    watch: bindActionCreators({ fetchWatchDetails }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Watch);
