import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import rootSaga from './sagas';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route } from 'react-router';
import { history } from './services';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Reader from './containers/Reader';
import Collection from './containers/Collection';
import Explorer from './containers/Explorer';

import './styles/main.scss';

// Needed for React Developer Tools
window.React = React;

let store = configureStore();
store.runSaga(rootSaga);

injectTapEventPlugin();

const App = () => (
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={history}>
			<Route path="/" component={Explorer}/>
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
