import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import rootSaga from './sagas';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { history } from './services';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Reader from 'containers/Reader';
import Collection from 'containers/Collection';
import Explorer from 'containers/Explorer';
import Info from 'containers/Info';

import { initializeApp } from 'utils';

import 'styles/main.scss';

// Needed for React Developer Tools
window.React = React;

let store = configureStore();
store.runSaga(rootSaga, store.dispatch);

if (window.PLATFORM === 'electron') {
	const { webFrame } = require('electron');
	webFrame.setZoomFactor(1);
	webFrame.setZoomLevelLimits(1, 1);
}

injectTapEventPlugin();

const App = () => (
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={syncHistoryWithStore(history, store)}>
			<Route path="/" component={Explorer}/>
			<Route path="/reader/:site/:chapter" component={Reader}/>
			<Route path="/collection" component={Collection} />
			<Route path="/explore" component={Explorer}/>
			<Route path="/info" component={Info} />
		</Router>
	</MuiThemeProvider>
);

initializeApp({callback: () => {
	ReactDOM.render(
		<Provider store={ store }>
			<App />
		</Provider>,
		document.getElementById('app')
	);
}, store});
