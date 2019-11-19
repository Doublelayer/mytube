import React from 'react';
import { HeaderNav, SideBar } from '../../utils/ComponentExporter';
import './App.sass';

function App() {
  return (
    <React.Fragment>
      <HeaderNav />
      <SideBar />
    </React.Fragment>
  );
}

export default App;
