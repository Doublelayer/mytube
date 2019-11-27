import React from 'react';
import './Home.scss';
import { HomeContent, SideBar } from '../../utils/ComponentExporter';

import { connect } from 'react-redux';
import * as videoActions from '../../store/actions/video';
import { bindActionCreators } from 'redux';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryIndex: 0
    };
  }
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <HomeContent />
      </React.Fragment>
    );
  }
  componentDidMount() {
    this.props.actions.fetchAllVideos();
  }
}

function mapDispatchToProps(dispatch) {
  const fetchAllVideos = videoActions.mostPopular.request;

  return {
    actions: bindActionCreators({ fetchAllVideos }, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Home);
