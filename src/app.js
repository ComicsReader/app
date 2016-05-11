import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Main from './containers/Main';

import './less/main.less';

var site = /site\/(\w*)\//.exec(window.location.hash)[1];

// Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Main />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.body);
