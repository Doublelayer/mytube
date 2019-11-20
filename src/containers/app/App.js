import React from 'react';
import { HeaderNav, Home } from '../../utils/ComponentExporter';
import './App.sass';

function App() {
  return (
    <React.Fragment>
      <HeaderNav />
      <Home />
    </React.Fragment>
  );
}

export default App;
