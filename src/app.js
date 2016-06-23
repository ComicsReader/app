import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, hashHistory } from 'react-router';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Reader from './containers/Reader';
import Collection from './containers/Collection';
import Explorer from './containers/Explorer';

import './less/main.less';

// Needed for React Developer Tools
window.React = React;

let store = configureStore();

injectTapEventPlugin();

const App = () => (
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
			<Route path="/" component={Collection}/>
			<Route path="/reader/:site/:chapter" component={Reader}/>
			<Route path="/explore" component={Explorer}/>
		</Router>
	</MuiThemeProvider>
);

ReactDOM.render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById('app')
);
