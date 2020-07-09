import React from 'react';
import { Menu } from 'semantic-ui-react';
import { SideBarFooter } from '../../utils/Exporter';
import './SideBar.scss';

export default SideBar;

export function SideBar(props) {
  return (
    <Menu borderless vertical stackable fixed="left" className="side-nav">
      {props.children}
      <SideBarFooter />
    </Menu>
  );
}
