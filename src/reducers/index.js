import { combineReducers } from 'redux';
import comics from './comic';
import searchState from './search';
import uiState from './ui';
import config from './config';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
	comics,
	searchState,
	uiState,
	config,
	routing: routerReducer
});

export default rootReducer;
