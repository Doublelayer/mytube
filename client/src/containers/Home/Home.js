import React from 'react';
import './Home.scss';
import { HomeContent, SideBar } from '../../utils/ComponentExporter';

export class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SideBar />
        <HomeContent />
      </React.Fragment>
    );
  }
}
export default Home;
