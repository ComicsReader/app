import { combineReducers } from 'redux';
import comics from './comic';
import searchState from './search';
import uiState from './ui';

const rootReducer = combineReducers({
	comics,
	searchState,
	uiState
});

export default rootReducer;
