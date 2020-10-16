/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './assets/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './redux/app-redux';
import React from 'react';

function myApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => myApp);
