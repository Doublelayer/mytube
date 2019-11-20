import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import { SideBarHeader, Favorite } from '../../../utils/ComponentExporter';

class Favorites extends Component {
  render() {
    return (
      <React.Fragment>
        <SideBarHeader title="Subscriptions" />
        <Favorite label="MusicChannel" broadcasting />
        <Favorite label="Coursea" amountNewVideos={10} />
        <Favorite label="TEDx Talks" amountNewVideos={23} />
        <Favorite label="Stanford iOS" amountNewVideos={4} />
        <Favorite label="Udacity" amountNewVideos={114} />
        <Divider />
      </React.Fragment>
    );
  }
}

export default Favorites;
