import React from 'react';
import { AppLayout, Home, Watch } from '../../utils/ComponentExporter';
import { Route, Switch } from 'react-router-dom';
import './App.sass';

function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/watch" component={Watch} />
        <Route path="/" component={Home} />
      </Switch>
    </AppLayout>
  );
}

export default App;
