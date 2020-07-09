import React from 'react';
import './Home.scss';
import { HomeContent, SideBar, SideBarItem, SideBarHeader, Favorites } from '../../utils/Exporter';
import { Divider } from 'semantic-ui-react';

export default function Home() {
  return (
    <React.Fragment>
      <SideBar >
        <SideBarItem highlight={true} label="Home" icon="home" />
        <SideBarItem label="Trending" icon="fire" />
        <SideBarItem label="Followers" icon="spy" />
        <Divider />
        <SideBarHeader title="Bibliothek" />
        <SideBarItem label="History" icon="history" />
        <SideBarItem label="Watch later" icon="clock" />
        <SideBarItem label="Liked videos" icon="thumbs up" />
        <Divider />
        <Favorites />
        <SideBarHeader title="Mehr" />
        <SideBarItem label="Movies and Shows" icon="film" />
        <Divider />
        <SideBarItem label="Report history" icon="flag" />
        <SideBarItem label="Help" icon="help circle" />
        <SideBarItem label="Send feedback" icon="comment" />
        <Divider />
      </SideBar>
      <HomeContent />
    </React.Fragment>
  );
}
