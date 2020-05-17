import React from 'react';
import './Home.scss';
import { HomeContent, SideBar } from '../../utils/ComponentExporter';

export default function Home() {
  return (
    <React.Fragment>
      <SideBar />
      <HomeContent />
    </React.Fragment>
  )
}
