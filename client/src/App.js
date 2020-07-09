import React, { Component } from 'react';
import { AppLayout, AdminLayout, Home, Watch, VideoSettings, Statistics, MusicSettings, PictureSettings, GlobalSettings } from './utils/Exporter';
import { Route, Switch, withRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={['/watch', '/']}>
          <AppLayout>
            <Route exact path="/" component={Home} />
            <Route path="/watch" component={Watch} />
          </AppLayout>
        </Route>
        <Route path={['/settings']}>
          <AdminLayout>
            <Route path="/settings/statistics" component={Statistics} />
            <Route path="/settings/videos" component={VideoSettings} />
            <Route path="/settings/pictures" component={PictureSettings} />
            <Route path="/settings/music" component={MusicSettings} />
            <Route path="/settings/global" component={GlobalSettings} />
          </AdminLayout>
        </Route>
      </Switch>
    );
  }
}

export default withRouter(App);
