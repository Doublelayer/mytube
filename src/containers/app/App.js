import React from 'react';
import { HeaderNav, SideBar, Home } from '../../utils/ComponentExporter';
import './App.sass';

function App() {
  return (
    <React.Fragment>
      <HeaderNav />
      <SideBar />
      <Home />
    </React.Fragment>
  );
}

export default App;
