import React from 'react';
import './Layout.scss';
import { HeaderNav, SideBar, SideBarItem, SideBarHeader } from '../utils/Exporter';
import { Divider } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import "../styles/shared.scss"

export function AdminLayout(props) {
  let location = useLocation();

  const statistics = "/settings/statistics"
  const videos = "/settings/videos"
  const pictures = "/settings/pictures"
  const music = "/settings/music"
  const globalSettings = "/settings/global"


  return (
    <div className="app-layout">
      <HeaderNav />
      <SideBar>
        <SideBarHeader title="Konfiguration" />

        <NavLink exact to={statistics} activeClassName="active">
          <SideBarItem highlight={location.pathname === statistics} label="Statistik" icon="chart area" />
        </NavLink>

        <Divider />

        <NavLink exact to={videos} activeClassName="active">
          <SideBarItem highlight={location.pathname === videos} label="Videos" icon="file video" />
        </NavLink>

        <Divider />

        <NavLink exact to={pictures} activeClassName="active">
          <SideBarItem highlight={location.pathname === pictures} label="Bilder" icon="picture" />
        </NavLink>

        <Divider />

        <NavLink exact to={music} activeClassName="active">
          <SideBarItem highlight={location.pathname === music} label="Musik" icon="music" />
        </NavLink>

        <Divider />

        <NavLink exact to={globalSettings} activeClassName="active">
          <SideBarItem highlight={location.pathname === globalSettings} label="Globale Einstellungen" icon="settings" />
        </NavLink>

        <Divider />

      </SideBar>

      <div className="content-panel">
        {props.children}
      </div>
    </div>
  );
}
