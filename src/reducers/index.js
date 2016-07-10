import { combineReducers } from 'redux';
import comics from './comic';
import searchState from './search';
import uiState from './ui';
import config from './config';

const rootReducer = combineReducers({
	comics,
	searchState,
	uiState,
	config
});

export default rootReducer;
